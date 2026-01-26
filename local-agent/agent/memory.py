"""
Memory Manager - handles short-term and long-term memory using SQLite and optional vector store
"""

import asyncio
import json
import logging
import sqlite3
import aiosqlite
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Union
from dataclasses import dataclass, asdict
from pathlib import Path

logger = logging.getLogger(__name__)


@dataclass
class MemoryEntry:
    """Memory entry for storing conversations and context"""
    id: Optional[int] = None
    timestamp: Optional[datetime] = None
    content: str = ""
    metadata: Optional[Dict[str, Any]] = None
    embedding: Optional[List[float]] = None


class MemoryManager:
    """Memory manager using SQLite for persistence and optional vector store for semantic search"""
    
    def __init__(self, db_path: str = "memory.db", vector_store_path: Optional[str] = None):
        """
        Initialize memory manager
        
        Args:
            db_path: Path to SQLite database file
            vector_store_path: Optional path for vector store (e.g., Chroma)
        """
        self.db_path = db_path
        self.vector_store_path = vector_store_path
        self.conn: Optional[aiosqlite.Connection] = None
        self.vector_store = None
        
    async def initialize(self):
        """Initialize memory storage"""
        try:
            # Initialize SQLite database
            self.conn = await aiosqlite.connect(self.db_path)
            await self._create_tables()
            
            # Initialize vector store if path provided
            if self.vector_store_path:
                await self._initialize_vector_store()
            
            logger.info("Memory manager initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize memory manager: {e}")
            raise
    
    async def _create_tables(self):
        """Create necessary database tables"""
        if not self.conn:
            return
        
        async with self.conn.cursor() as cursor:
            # Create memories table
            await cursor.execute('''
                CREATE TABLE IF NOT EXISTS memories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    content TEXT NOT NULL,
                    metadata TEXT,
                    embedding TEXT
                )
            ''')

            # Create index for faster queries
            await cursor.execute('''
                CREATE INDEX IF NOT EXISTS idx_memories_timestamp ON memories(timestamp)
            ''')

            await self.conn.commit()
    
    async def _initialize_vector_store(self):
        """Initialize vector store for semantic search"""
        try:
            # Try to import and initialize Chroma
            from chromadb import Client
            from chromadb.config import Settings
            
            self.vector_store = Client(Settings(
                chroma_db_impl="sqlite",
                persist_directory=self.vector_store_path
            ))
            
            # Create collection for embeddings
            self.collection = self.vector_store.get_or_create_collection(
                name="memories",
                metadata={"hnsw:space": "cosine"}
            )
            
            logger.info("Vector store initialized successfully")
            
        except ImportError:
            logger.warning("Chroma not available, semantic search disabled")
            self.vector_store = None
        except Exception as e:
            logger.error(f"Failed to initialize vector store: {e}")
            self.vector_store = None
    
    async def add_memory(
        self, 
        content: str, 
        metadata: Optional[Dict[str, Any]] = None,
        embedding: Optional[List[float]] = None
    ) -> int:
        """
        Add a memory entry
        
        Args:
            content: The memory content
            metadata: Optional metadata
            embedding: Optional embedding vector for semantic search
            
        Returns:
            ID of the created memory entry
        """
        if not self.conn:
            await self.initialize()
        
        try:
            async with self.conn.cursor() as cursor:
                # Insert into SQLite
                await cursor.execute('''
                    INSERT INTO memories (content, metadata, embedding)
                    VALUES (?, ?, ?)
                ''', (
                    content,
                    json.dumps(metadata) if metadata else None,
                    json.dumps(embedding) if embedding else None
                ))

                memory_id = cursor.lastrowid
                await self.conn.commit()
            
            # Add to vector store if available
            if self.vector_store and embedding:
                try:
                    self.collection.add(
                        documents=[content],
                        metadatas=[metadata or {}],
                        embeddings=[embedding],
                        ids=[str(memory_id)]
                    )
                except Exception as e:
                    logger.warning(f"Failed to add to vector store: {e}")
            
            return memory_id
            
        except Exception as e:
            logger.error(f"Failed to add memory: {e}")
            raise
    
    async def get_relevant_context(
        self, 
        query: str, 
        limit: int = 5,
        time_window_hours: int = 24
    ) -> List[str]:
        """
        Get relevant context from memory
        
        Args:
            query: Query to find relevant memories
            limit: Maximum number of memories to return
            time_window_hours: Time window in hours for recent memories
            
        Returns:
            List of relevant memory contents
        """
        if not self.conn:
            await self.initialize()
        
        try:
            # Get recent memories from SQLite
            cutoff_time = datetime.now() - timedelta(hours=time_window_hours)
            
            async with self.conn.execute('''
                SELECT content, metadata, embedding
                FROM memories
                WHERE timestamp > ?
                ORDER BY timestamp DESC
                LIMIT ?
            ''', (cutoff_time, limit * 2)) as cursor:
                recent_memories = await cursor.fetchall()
            
            # If we have vector store, use semantic search
            if self.vector_store and self.collection:
                try:
                    # Generate embedding for query (simplified - in practice you'd use your embedding model)
                    query_embedding = await self._generate_embedding(query)
                    
                    results = self.collection.query(
                        query_embeddings=[query_embedding],
                        n_results=limit,
                        where={"timestamp": {"$gt": cutoff_time.isoformat()}}
                    )
                    
                    # Combine results
                    relevant_contents = []
                    if results and results["documents"]:
                        relevant_contents.extend(results["documents"][0])
                    
                    # Fill with recent memories if needed
                    for content, _, _ in recent_memories:
                        if content not in relevant_contents:
                            relevant_contents.append(content)
                        if len(relevant_contents) >= limit:
                            break
                    
                    return relevant_contents[:limit]
                    
                except Exception as e:
                    logger.warning(f"Vector search failed, falling back to time-based: {e}")
            
            # Fallback to time-based retrieval
            return [content for content, _, _ in recent_memories[:limit]]
            
        except Exception as e:
            logger.error(f"Failed to get relevant context: {e}")
            return []
    
    async def get_conversation_history(
        self, 
        limit: int = 10,
        time_window_hours: int = 24
    ) -> List[Dict[str, str]]:
        """
        Get recent conversation history
        
        Args:
            limit: Maximum number of messages to return
            time_window_hours: Time window in hours
            
        Returns:
            List of conversation messages
        """
        if not self.conn:
            await self.initialize()
        
        try:
            cutoff_time = datetime.now() - timedelta(hours=time_window_hours)
            
            async with self.conn.execute('''
                SELECT content, metadata
                FROM memories
                WHERE timestamp > ?
                AND (metadata IS NULL OR json_extract(metadata, '$.type') = 'conversation')
                ORDER BY timestamp DESC
                LIMIT ?
            ''', (cutoff_time, limit)) as cursor:
                rows = await cursor.fetchall()
            
            messages = []
            for content, metadata_str in rows:
                metadata = json.loads(metadata_str) if metadata_str else {}
                messages.append({
                    "content": content,
                    "role": metadata.get("role", "assistant"),
                    "timestamp": metadata.get("timestamp")
                })
            
            return messages
            
        except Exception as e:
            logger.error(f"Failed to get conversation history: {e}")
            return []
    
    async def clear_old_memories(self, days: int = 30):
        """Clear memories older than specified days"""
        if not self.conn:
            return
        
        try:
            cutoff_date = datetime.now() - timedelta(days=days)
            
            async with self.conn.cursor() as cursor:
                await cursor.execute('''
                    DELETE FROM memories
                    WHERE timestamp < ?
                ''', (cutoff_date,))

                deleted_count = cursor.rowcount
                await self.conn.commit()
            
            logger.info(f"Cleared {deleted_count} old memories")
            
        except Exception as e:
            logger.error(f"Failed to clear old memories: {e}")
    
    async def _generate_embedding(self, text: str) -> List[float]:
        """
        Generate embedding for text (placeholder implementation)
        
        In a real implementation, you would use your embedding model here.
        For now, this is a placeholder that returns a simple hash-based vector.
        """
        # Placeholder implementation - replace with actual embedding model
        import hashlib
        
        # Simple hash-based embedding for demonstration
        hash_object = hashlib.md5(text.encode())
        hash_hex = hash_object.hexdigest()
        
        # Convert hex to float vector
        vector = []
        for i in range(0, len(hash_hex), 2):
            byte_val = int(hash_hex[i:i+2], 16)
            vector.append(byte_val / 255.0)  # Normalize to 0-1
        
        # Pad or truncate to fixed size (e.g., 128 dimensions)
        while len(vector) < 128:
            vector.append(0.0)
        vector = vector[:128]
        
        return vector
    
    async def cleanup(self):
        """Clean up resources"""
        if self.conn:
            await self.conn.close()
            self.conn = None
        
        if self.vector_store:
            self.vector_store = None
        
        logger.info("Memory manager cleaned up")
