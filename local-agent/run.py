"""
Entry point for running the local agent
"""

import asyncio
import logging
import sys
from pathlib import Path

# Add the local-agent directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from agent.controller import AgentController
from agent.llm import LLMWrapper
from agent.memory import MemoryManager
from agent.tools import ToolExecutor

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


async def main():
    """Main entry point for the agent"""
    print("🚀 Starting Local Agent...")
    print("=" * 50)

    # Load configuration
    try:
        from config import get_config, print_config

        config = get_config()
        print_config(config)
        print()
    except Exception as e:
        logger.warning(f"Failed to load config, using defaults: {e}")

        # Fallback to defaults
        class DefaultConfig:
            class model:
                path = "models/qwen2.5-coder-7b-awq"
                config_path = None
                max_tokens = 1000
                temperature = 0.7
                top_p = 0.9

            working_dir = "."

        config = DefaultConfig()

    # Check if model directory exists
    model_dir = Path(config.model.path)
    if not model_dir.exists():
        print(f"⚠️  Warning: Model directory not found: {config.model.path}")
        print(
            "Please ensure the model is downloaded and placed in the correct location."
        )
        print("To download a model, run:")
        print("  python download_model.py --model qwen2.5-coder-7b-awq")
        print()

    try:
        # Initialize components
        print("📦 Initializing components...")

        # Initialize LLM
        print("  • Loading LLM...")
        llm = LLMWrapper(config.model.path, config.model.config_path)
        await llm.initialize()

        # Initialize tools
        print("  • Setting up tools...")
        tools = ToolExecutor(config.working_dir)

        # Initialize memory
        print("  • Initializing memory...")
        memory = MemoryManager()
        await memory.initialize()

        # Create agent controller
        print("  • Creating agent controller...")
        agent = AgentController(llm, tools, memory)

        print("✅ Agent initialized successfully!")
        print()

        # Interactive loop
        print("🤖 Agent is ready! Type 'exit' to quit.")
        print("💡 Try asking: 'What files are in the current directory?'")
        print()

        while True:
            try:
                # Get user input
                user_input = input("You: ").strip()

                if user_input.lower() in ["exit", "quit", "bye"]:
                    print("👋 Goodbye!")
                    break

                if not user_input:
                    continue

                print("🤔 Thinking...")

                # Process query
                response = await agent.process_query(user_input)

                if response.success:
                    print(f"Agent: {response.result}")
                else:
                    print(f"❌ Error: {response.error}")

                print()

            except KeyboardInterrupt:
                print("\n👋 Goodbye!")
                break
            except Exception as e:
                print(f"❌ Error processing input: {e}")
                print()

    except Exception as e:
        logger.error(f"Failed to start agent: {e}")
        print(f"❌ Failed to start agent: {e}")
        sys.exit(1)

    finally:
        # Cleanup
        try:
            if "agent" in locals():
                await agent.memory.cleanup()
                if hasattr(agent.llm, "cleanup"):
                    await agent.llm.cleanup()
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")


if __name__ == "__main__":
    asyncio.run(main())
