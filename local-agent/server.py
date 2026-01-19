"""
FastAPI server for the local agent
"""

import logging
from contextlib import asynccontextmanager
from typing import Dict, List, Optional

from agent.controller import AgentController
from agent.llm import LLMWrapper
from agent.memory import MemoryManager
from agent.tools import ToolExecutor
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


class QueryRequest(BaseModel):
    """Request model for agent queries"""

    query: str
    model_path: Optional[str] = None
    config_path: Optional[str] = None
    working_dir: Optional[str] = None


class QueryResponse(BaseModel):
    """Response model for agent queries"""

    success: bool
    message: str
    result: Optional[str] = None
    error: Optional[str] = None
    tool_calls: Optional[List[Dict]] = None


class AgentStateResponse(BaseModel):
    """Response model for agent state"""

    state: str
    working_dir: str
    model_path: Optional[str] = None


# Global agent instance
agent: Optional[AgentController] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown"""
    # Startup
    logger.info("Starting local agent server...")
    yield
    # Shutdown
    if agent:
        await agent.memory.cleanup()
        if hasattr(agent.llm, "cleanup"):
            await agent.llm.cleanup()
    logger.info("Local agent server shutdown complete")


# Create FastAPI app
app = FastAPI(
    title="Local Agent API",
    description="API for local AI agent with LLM, tools, and memory",
    version="1.0.0",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize the agent on startup"""
    global agent

    # Load configuration
    try:
        from config import get_config, print_config

        config = get_config()
        logger.info("Configuration loaded:")
        print_config(config)
    except Exception as e:
        logger.warning(f"Failed to load config, using defaults: {e}")

        # Fallback to defaults
        class DefaultConfig:
            class model:
                path = "models/qwen2.5-coder-7b-awq"
                config_path = None

            class memory:
                db_path = "memory.db"
                vector_store_path = "vector_store"

            working_dir = "."

        config = DefaultConfig()

    try:
        # Initialize components
        llm = LLMWrapper(config.model.path, config.model.config_path)
        tools = ToolExecutor(config.working_dir)
        memory = MemoryManager(config.memory.db_path, config.memory.vector_store_path)

        # Initialize memory
        await memory.initialize()

        # Create agent controller
        agent = AgentController(llm, tools, memory)

        logger.info("Agent initialized successfully")

    except Exception as e:
        logger.error(f"Failed to initialize agent: {e}")
        raise


@app.post("/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    """Process a query through the agent"""
    global agent

    if not agent:
        raise HTTPException(status_code=500, detail="Agent not initialized")

    try:
        # Update working directory if provided
        if request.working_dir:
            agent.tools.set_working_directory(request.working_dir)

        # Process query
        response = await agent.process_query(request.query)

        return QueryResponse(
            success=response.success,
            message=response.message,
            result=response.result if response.success else None,
            error=response.error,
            tool_calls=response.tool_calls,
        )

    except Exception as e:
        logger.error(f"Error processing query: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/state", response_model=AgentStateResponse)
async def get_agent_state():
    """Get current agent state"""
    global agent

    if not agent:
        raise HTTPException(status_code=500, detail="Agent not initialized")

    return AgentStateResponse(
        state=agent.get_state().value,
        working_dir=agent.tools.working_dir,
        model_path=agent.llm.model_path if agent.llm else None,
    )


@app.post("/clear_memory")
async def clear_memory(days: int = 30):
    """Clear old memories"""
    global agent

    if not agent:
        raise HTTPException(status_code=500, detail="Agent not initialized")

    try:
        await agent.memory.clear_old_memories(days)
        return {"message": f"Cleared memories older than {days} days"}

    except Exception as e:
        logger.error(f"Error clearing memory: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "agent_initialized": agent is not None}


if __name__ == "__main__":
    import uvicorn

    # Load configuration
    try:
        from config import get_config

        config = get_config()
        host = config.server.host
        port = config.server.port
        reload = config.server.reload
    except:
        host = "0.0.0.0"
        port = 8000
        reload = False

    # Run the server
    uvicorn.run("server:app", host=host, port=port, reload=reload)
