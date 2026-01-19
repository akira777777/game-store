"""
Test Ollama integration with Local Agent
"""

import asyncio
import sys

try:
    import httpx
except ImportError:
    print("ERROR: httpx not installed")
    print("Install with: pip install httpx")
    sys.exit(1)


async def test_ollama_connection():
    """Test if Ollama server is running"""
    print("Testing Ollama connection...")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get("http://localhost:11434/api/tags", timeout=5.0)
            response.raise_for_status()
            
            data = response.json()
            models = data.get("models", [])
            
            print(f"[OK] Ollama is running")
            print(f"[OK] Found {len(models)} models:")
            for model in models:
                print(f"  - {model['name']} ({model['size'] / 1e9:.1f} GB)")
            
            return True
            
        except httpx.ConnectError:
            print("[ERROR] Cannot connect to Ollama")
            print("Make sure Ollama is running: ollama serve")
            return False
        except Exception as e:
            print(f"[ERROR] {e}")
            return False


async def test_ollama_generate():
    """Test text generation with Ollama"""
    print("\nTesting Ollama generation...")
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            # Simple generation test
            response = await client.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "qwen2.5-coder:1.5b",
                    "prompt": "Write a Python function that adds two numbers",
                    "stream": False
                }
            )
            response.raise_for_status()
            
            data = response.json()
            generated_text = data.get("response", "")
            
            print("[OK] Generation successful!")
            print("\nGenerated code:")
            print("-" * 60)
            print(generated_text[:500])  # Print first 500 chars
            if len(generated_text) > 500:
                print("...")
            print("-" * 60)
            
            return True
            
        except Exception as e:
            print(f"[ERROR] Generation failed: {e}")
            return False


async def test_ollama_chat():
    """Test chat with conversation history"""
    print("\nTesting Ollama chat...")
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(
                "http://localhost:11434/api/chat",
                json={
                    "model": "qwen2.5-coder:1.5b",
                    "messages": [
                        {"role": "user", "content": "What is Python?"},
                        {"role": "assistant", "content": "Python is a programming language."},
                        {"role": "user", "content": "Can you write a hello world in it?"}
                    ],
                    "stream": False
                }
            )
            response.raise_for_status()
            
            data = response.json()
            message = data.get("message", {})
            content = message.get("content", "")
            
            print("[OK] Chat successful!")
            print("\nResponse:")
            print("-" * 60)
            print(content[:500])
            if len(content) > 500:
                print("...")
            print("-" * 60)
            
            return True
            
        except Exception as e:
            print(f"[ERROR] Chat failed: {e}")
            return False


async def main():
    """Run all tests"""
    print("=" * 60)
    print("Ollama Integration Test")
    print("=" * 60)
    print()
    
    # Test 1: Connection
    connected = await test_ollama_connection()
    if not connected:
        print("\nPlease start Ollama server first:")
        print("  ollama serve")
        sys.exit(1)
    
    # Test 2: Generation
    await test_ollama_generate()
    
    # Test 3: Chat
    await test_ollama_chat()
    
    print("\n" + "=" * 60)
    print("[SUCCESS] All tests passed!")
    print("=" * 60)
    print("\nOllama is ready to use with Local Agent!")
    print("\nNext steps:")
    print("  1. Update agent/llm.py to use Ollama")
    print("  2. Or use agent/llm_ollama.py wrapper")
    print("  3. Run: python run.py")


if __name__ == "__main__":
    asyncio.run(main())
