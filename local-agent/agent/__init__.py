"""
Local AI Agent Package

Components:
- controller: Agent orchestration and workflow
- llm: LLM wrapper for ExLlamaV2
- memory: Memory management (SQLite + Vector Store)
- tools: Tool execution (shell, git, python)
"""

from .controller import AgentController, AgentState, AgentResponse
from .llm import LLMWrapper, LLMResponse
from .memory import MemoryManager, MemoryEntry
from .tools import ToolExecutor, ToolResult

__version__ = "1.0.0"
__all__ = [
    "AgentController",
    "AgentState",
    "AgentResponse",
    "LLMWrapper",
    "LLMResponse",
    "MemoryManager",
    "MemoryEntry",
    "ToolExecutor",
    "ToolResult",
]
