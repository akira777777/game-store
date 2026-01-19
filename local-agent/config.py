"""
Configuration management for Local Agent
Loads settings from environment variables or .env file
"""

import os
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

try:
    from dotenv import load_dotenv

    # Load .env file if exists
    env_path = Path(__file__).parent / ".env"
    if env_path.exists():
        load_dotenv(env_path)
except ImportError:
    # python-dotenv not installed, skip
    pass


@dataclass
class ModelConfig:
    """LLM Model configuration"""

    path: str
    config_path: Optional[str] = None
    max_tokens: int = 1000
    temperature: float = 0.7
    top_p: float = 0.9


@dataclass
class ServerConfig:
    """API Server configuration"""

    host: str = "0.0.0.0"
    port: int = 8000
    reload: bool = False


@dataclass
class MemoryConfig:
    """Memory storage configuration"""

    db_path: str = "memory.db"
    vector_store_path: Optional[str] = "vector_store"
    cleanup_days: int = 30


@dataclass
class AgentConfig:
    """Main agent configuration"""

    model: ModelConfig
    server: ServerConfig
    memory: MemoryConfig
    working_dir: str = "."


def get_config() -> AgentConfig:
    """
    Load configuration from environment variables

    Environment variables:
        MODEL_PATH: Path to model directory
        MODEL_CONFIG_PATH: Optional path to model config file
        MAX_TOKENS: Maximum tokens to generate (default: 1000)
        TEMPERATURE: Sampling temperature (default: 0.7)
        TOP_P: Top-p sampling (default: 0.9)

        API_HOST: API server host (default: 0.0.0.0)
        API_PORT: API server port (default: 8000)
        API_RELOAD: Enable auto-reload (default: False)

        MEMORY_DB_PATH: Path to memory database (default: memory.db)
        VECTOR_STORE_PATH: Path to vector store (default: vector_store)
        MEMORY_CLEANUP_DAYS: Days to keep memories (default: 30)

        WORKING_DIR: Working directory for tools (default: .)
    """

    # Model configuration
    model_config = ModelConfig(
        path=os.getenv("MODEL_PATH", "models/qwen2.5-coder-7b-awq"),
        config_path=os.getenv("MODEL_CONFIG_PATH"),
        max_tokens=int(os.getenv("MAX_TOKENS", "1000")),
        temperature=float(os.getenv("TEMPERATURE", "0.7")),
        top_p=float(os.getenv("TOP_P", "0.9")),
    )

    # Server configuration
    server_config = ServerConfig(
        host=os.getenv("API_HOST", "0.0.0.0"),
        port=int(os.getenv("API_PORT", "8000")),
        reload=os.getenv("API_RELOAD", "false").lower() == "true",
    )

    # Memory configuration
    memory_config = MemoryConfig(
        db_path=os.getenv("MEMORY_DB_PATH", "memory.db"),
        vector_store_path=os.getenv("VECTOR_STORE_PATH", "vector_store"),
        cleanup_days=int(os.getenv("MEMORY_CLEANUP_DAYS", "30")),
    )

    # Agent configuration
    return AgentConfig(
        model=model_config,
        server=server_config,
        memory=memory_config,
        working_dir=os.getenv("WORKING_DIR", "."),
    )


def print_config(config: AgentConfig):
    """Print current configuration"""
    print("=" * 50)
    print("Configuration:")
    print("=" * 50)
    print("\nModel:")
    print(f"  Path: {config.model.path}")
    print(f"  Max Tokens: {config.model.max_tokens}")
    print(f"  Temperature: {config.model.temperature}")
    print(f"  Top-P: {config.model.top_p}")

    print("\nServer:")
    print(f"  Host: {config.server.host}")
    print(f"  Port: {config.server.port}")
    print(f"  Reload: {config.server.reload}")

    print("\nMemory:")
    print(f"  Database: {config.memory.db_path}")
    print(f"  Vector Store: {config.memory.vector_store_path}")
    print(f"  Cleanup Days: {config.memory.cleanup_days}")

    print(f"\nWorking Directory: {config.working_dir}")
    print("=" * 50)


if __name__ == "__main__":
    # Test configuration loading
    config = get_config()
    print_config(config)
