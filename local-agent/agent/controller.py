"""
Agent Controller - orchestrates LLM, tools, and memory
"""

import asyncio
import json
import logging
from typing import Any, Dict, List, Optional, Union
from dataclasses import dataclass
from enum import Enum

from .llm import LLMWrapper
from .tools import ToolExecutor
from .memory import MemoryManager

logger = logging.getLogger(__name__)


class AgentState(Enum):
    IDLE = "idle"
    THINKING = "thinking"
    EXECUTING = "executing"
    COMPLETED = "completed"
    ERROR = "error"


@dataclass
class AgentResponse:
    """Response from agent execution"""
    success: bool
    message: str
    result: Optional[Any] = None
    error: Optional[str] = None
    tool_calls: List[Dict[str, Any]] = None


class AgentController:
    """Main agent controller that orchestrates LLM, tools, and memory"""
    
    def __init__(self, llm: LLMWrapper, tools: ToolExecutor, memory: MemoryManager):
        self.llm = llm
        self.tools = tools
        self.memory = memory
        self.state = AgentState.IDLE
        self.conversation_history: List[Dict[str, str]] = []
        
    async def process_query(self, query: str) -> AgentResponse:
        """Process a user query through the agent"""
        try:
            self.state = AgentState.THINKING
            
            # Get relevant context from memory
            context = await self.memory.get_relevant_context(query)
            
            # Build prompt with context and conversation history
            prompt = self._build_prompt(query, context)
            
            # Get LLM response
            llm_response = await self.llm.generate(prompt, self.conversation_history)
            
            # Parse and execute tool calls if any
            if llm_response.get("tool_calls"):
                return await self._execute_tool_calls(llm_response["tool_calls"])
            
            # Store conversation in memory
            await self._update_memory(query, llm_response["content"])
            
            self.state = AgentState.COMPLETED
            return AgentResponse(
                success=True,
                message="Query processed successfully",
                result=llm_response["content"]
            )
            
        except Exception as e:
            logger.error(f"Error processing query: {e}")
            self.state = AgentState.ERROR
            return AgentResponse(
                success=False,
                message="Error processing query",
                error=str(e)
            )
    
    async def _execute_tool_calls(self, tool_calls: List[Dict[str, Any]]) -> AgentResponse:
        """Execute multiple tool calls sequentially"""
        results = []
        
        for tool_call in tool_calls:
            tool_name = tool_call["name"]
            arguments = tool_call["arguments"]
            
            try:
                # Execute the tool
                result = await self.tools.execute_tool(tool_name, arguments)
                results.append({
                    "tool": tool_name,
                    "success": True,
                    "result": result
                })
                
                # Store tool execution in memory
                await self.memory.add_memory(
                    f"Executed tool: {tool_name}",
                    f"Arguments: {arguments}\nResult: {result}"
                )
                
            except Exception as e:
                logger.error(f"Error executing tool {tool_name}: {e}")
                results.append({
                    "tool": tool_name,
                    "success": False,
                    "error": str(e)
                })
        
        return AgentResponse(
            success=all(r["success"] for r in results),
            message="Tool execution completed",
            result=results
        )
    
    def _build_prompt(self, query: str, context: List[str]) -> str:
        """Build the prompt for the LLM with context"""
        prompt = f"""You are an AI agent that helps users with software development tasks.
        
Context from memory:
{chr(10).join(f"- {c}" for c in context[:3])}

Current conversation:
{chr(10).join(f"{msg['role']}: {msg['content']}" for msg in self.conversation_history[-5:])}

User query: {query}

Available tools:
{chr(10).join(f"- {name}: {desc}" for name, desc in self.tools.get_tool_descriptions().items())}

Please respond with either:
1. A direct answer to the user's question, OR
2. Tool calls in JSON format if you need to use tools to complete the task

If using tools, respond with:
{{
    "tool_calls": [
        {{
            "name": "tool_name",
            "arguments": {{"param1": "value1", "param2": "value2"}}
        }}
    ]
}}

Do not include any other text in your response."""
        
        return prompt
    
    async def _update_memory(self, query: str, response: str):
        """Update conversation history and memory"""
        self.conversation_history.extend([
            {"role": "user", "content": query},
            {"role": "assistant", "content": response}
        ])
        
        # Keep only last 10 messages in conversation history
        if len(self.conversation_history) > 10:
            self.conversation_history = self.conversation_history[-10:]
        
        # Store in memory manager
        await self.memory.add_memory(query, response)
    
    def get_state(self) -> AgentState:
        """Get current agent state"""
        return self.state