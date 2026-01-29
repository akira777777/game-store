"""
LLM Wrapper for ExLlamaV2 integration
"""

import asyncio
import logging
from typing import Any, Dict, List, Optional, Union
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class LLMResponse:
    """Response from LLM generation"""
    content: str
    tool_calls: Optional[List[Dict[str, Any]]] = None
    usage: Optional[Dict[str, int]] = None


class LLMWrapper:
    """Wrapper for ExLlamaV2 LLM integration"""
    
    def __init__(self, model_path: str, config_path: Optional[str] = None):
        """
        Initialize LLM wrapper
        
        Args:
            model_path: Path to the model directory
            config_path: Optional path to config file
        """
        self.model_path = model_path
        self.config_path = config_path
        self.model = None
        self.tokenizer = None
        self.initialized = False
        self.lock = asyncio.Lock()
        
    async def initialize(self):
        """Initialize the LLM model"""
        try:
            # Import ExLlamaV2 modules
            from exllamav2 import (
                ExLlamaV2, ExLlamaV2Config, ExLlamaV2Cache, ExLlamaV2Tokenizer
            )
            from exllamav2.generator import ExLlamaV2StreamingGenerator
            
            # Load configuration
            config = ExLlamaV2Config()
            config.model_dir = self.model_path
            if self.config_path:
                config.config_file = self.config_path
            
            # Initialize model
            self.model = ExLlamaV2(config)
            self.cache = ExLlamaV2Cache(self.model)
            self.model.load(self.cache)
            
            # Initialize tokenizer
            self.tokenizer = ExLlamaV2Tokenizer(config, self.model)
            
            self.initialized = True
            logger.info("LLM model initialized successfully")
            
        except ImportError:
            logger.error("ExLlamaV2 not installed. Please install: pip install exllamav2")
            raise
        except Exception as e:
            logger.error(f"Failed to initialize LLM: {e}")
            raise
    
    async def generate(
        self, 
        prompt: str, 
        conversation_history: Optional[List[Dict[str, str]]] = None,
        max_tokens: int = 1000,
        temperature: float = 0.7,
        top_p: float = 0.9
    ) -> LLMResponse:
        """
        Generate response from the LLM
        
        Args:
            prompt: The input prompt
            conversation_history: Optional conversation history
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature
            top_p: Top-p sampling parameter
            
        Returns:
            LLMResponse containing generated content and tool calls
        """
        if not self.initialized:
            await self.initialize()
        
        try:
            # Build full prompt with conversation history
            full_prompt = self._build_full_prompt(prompt, conversation_history)
            
            # Generate response
            response = await self._generate_with_exllamav2(
                full_prompt, max_tokens, temperature, top_p
            )
            
            # Parse for tool calls
            tool_calls = self._parse_tool_calls(response)
            
            return LLMResponse(
                content=response,
                tool_calls=tool_calls
            )
            
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            raise
    
    def _build_full_prompt(
        self, 
        prompt: str, 
        conversation_history: Optional[List[Dict[str, str]]]
    ) -> str:
        """Build full prompt including conversation history"""
        if not conversation_history:
            return prompt
        
        # Format conversation history
        history_text = ""
        for msg in conversation_history:
            role = msg["role"].upper()
            content = msg["content"]
            history_text += f"{role}: {content}\n"
        
        return f"{history_text}\nUSER: {prompt}\nASSISTANT:"
    
    def _generate_blocking(
        self,
        prompt: str,
        max_tokens: int,
        temperature: float,
        top_p: float
    ) -> str:
        """Blocking generation function to be run in executor"""
        from exllamav2.generator import ExLlamaV2StreamingGenerator
        
        # Create generator
        generator = ExLlamaV2StreamingGenerator(
            self.model,
            self.cache,
            self.tokenizer
        )
        
        # Set generation parameters
        settings = ExLlamaV2StreamingGenerator.Settings()
        settings.temperature = temperature
        settings.top_p = top_p
        settings.token_repetition_penalty = 1.0
        
        # Generate
        output = ""
        generator.begin_stream(prompt, settings)
        
        while True:
            chunk, eos, _ = generator.stream()
            if eos:
                break
            output += chunk

        return output

    async def _generate_with_exllamav2(
        self,
        prompt: str,
        max_tokens: int,
        temperature: float,
        top_p: float
    ) -> str:
        """Generate text using ExLlamaV2"""
        # Ensure thread safety with a lock since we are using shared resources
        async with self.lock:
            loop = asyncio.get_running_loop()
            return await loop.run_in_executor(
                None,
                self._generate_blocking,
                prompt,
                max_tokens,
                temperature,
                top_p
            )
    
    def _parse_tool_calls(self, response: str) -> Optional[List[Dict[str, Any]]]:
        """
        Parse tool calls from LLM response
        
        Expected format:
        {
            "tool_calls": [
                {
                    "name": "tool_name",
                    "arguments": {"param1": "value1", "param2": "value2"}
                }
            ]
        }
        """
        try:
            # Look for JSON in the response
            import json
            import re
            
            # Find JSON object in response
            json_match = re.search(r'\{[\s\S]*"tool_calls"[\s\S]*\}', response)
            if not json_match:
                return None
            
            json_str = json_match.group()
            parsed = json.loads(json_str)
            
            if "tool_calls" in parsed:
                return parsed["tool_calls"]
            
        except (json.JSONDecodeError, KeyError, re.error) as e:
            logger.debug(f"No tool calls found or error parsing: {e}")
        
        return None
    
    async def cleanup(self):
        """Clean up resources"""
        if self.cache:
            self.cache.free()
        if self.model:
            self.model.unload()
        self.initialized = False
        logger.info("LLM resources cleaned up")