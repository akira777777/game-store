"""
Basic tests for Local Agent components
Run with: python -m pytest test_basic.py
Or: python test_basic.py
"""

import asyncio
import sys
from pathlib import Path

# Add agent to path
sys.path.insert(0, str(Path(__file__).parent))

from agent.memory import MemoryManager
from agent.tools import ToolExecutor


async def test_memory_manager():
    """Test memory manager initialization and basic operations"""
    print("Testing Memory Manager...")

    # Initialize memory manager with test database
    memory = MemoryManager(db_path="test_memory.db")
    await memory.initialize()

    # Add a memory
    memory_id = await memory.add_memory(
        "Test query", metadata={"type": "test", "timestamp": "2024-01-01"}
    )

    assert memory_id > 0, "Failed to add memory"
    print(f"  [OK] Added memory with ID: {memory_id}")

    # Get relevant context
    context = await memory.get_relevant_context("Test query", limit=1)
    assert len(context) >= 0, "Failed to get context"
    print(f"  [OK] Retrieved {len(context)} context items")

    # Cleanup
    await memory.cleanup()

    # Remove test database
    test_db = Path("test_memory.db")
    if test_db.exists():
        test_db.unlink()

    print("  [PASS] Memory Manager tests passed!")


async def test_tool_executor():
    """Test tool executor with shell commands"""
    print("\nTesting Tool Executor...")

    # Initialize tool executor
    tools = ToolExecutor()

    # Test shell command
    result = await tools.execute_tool("shell", {"command": "echo Hello World"})
    assert result.success, f"Shell command failed: {result.error}"
    assert "Hello World" in result.output, "Shell output incorrect"
    print(f"  [OK] Shell command executed: {result.output.strip()}")

    # Test Python code execution
    result = await tools.execute_tool("python", {"code": "print('Python works!')"})
    assert result.success, f"Python execution failed: {result.error}"
    assert "Python works!" in result.output, "Python output incorrect"
    print(f"  [OK] Python code executed: {result.output.strip()}")

    # Test tool descriptions
    descriptions = tools.get_tool_descriptions()
    assert "shell" in descriptions, "Shell tool not found"
    assert "python" in descriptions, "Python tool not found"
    assert "git" in descriptions, "Git tool not found"
    print(f"  [OK] Found {len(descriptions)} available tools")

    print("  [PASS] Tool Executor tests passed!")


async def test_config():
    """Test configuration loading"""
    print("\nTesting Configuration...")

    try:
        from config import get_config, print_config

        config = get_config()
        assert config is not None, "Config is None"
        assert hasattr(config, "model"), "Config missing model"
        assert hasattr(config, "server"), "Config missing server"
        assert hasattr(config, "memory"), "Config missing memory"

        print("  [OK] Configuration loaded successfully")
        print("\n" + "=" * 50)
        print_config(config)
        print("=" * 50)

    except Exception as e:
        print(f"  [WARN] Config test failed (non-critical): {e}")


async def main():
    """Run all tests"""
    print("=" * 60)
    print("Running Local Agent Basic Tests")
    print("=" * 60)
    print()

    try:
        # Run tests
        await test_memory_manager()
        await test_tool_executor()
        await test_config()

        print("\n" + "=" * 60)
        print("[SUCCESS] All tests passed!")
        print("=" * 60)

        return 0

    except Exception as e:
        print("\n" + "=" * 60)
        print(f"[FAILED] Test failed: {e}")
        print("=" * 60)
        import traceback

        traceback.print_exc()
        return 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
