"""
Download Qwen models from Hugging Face
"""

import argparse
import sys
from pathlib import Path

try:
    from huggingface_hub import snapshot_download
except ImportError:
    print("Error: huggingface-hub not installed")
    print("Install with: pip install huggingface-hub")
    sys.exit(1)


# Available models
MODELS = {
    "qwen-1.8b": {
        "repo": "Qwen/Qwen-1_8B-Chat",
        "description": "Qwen 1.8B Chat (легкая модель, ~4GB VRAM)",
    },
    "qwen2.5-coder-7b-awq": {
        "repo": "Qwen/Qwen2.5-Coder-7B-Instruct-AWQ",
        "description": "Qwen 2.5 Coder 7B AWQ (рекомендуется, ~8GB VRAM)",
    },
    "qwen2.5-coder-14b-awq": {
        "repo": "Qwen/Qwen2.5-Coder-14B-Instruct-AWQ",
        "description": "Qwen 2.5 Coder 14B AWQ (требуется ~16GB VRAM)",
    },
    "qwen2.5-7b-instruct": {
        "repo": "Qwen/Qwen2.5-7B-Instruct",
        "description": "Qwen 2.5 7B Instruct (полная точность, требуется ~28GB VRAM)",
    },
}


def download_model(model_name: str, output_dir: str = "models"):
    """Download a model from Hugging Face"""
    if model_name not in MODELS:
        print(f"Error: Unknown model '{model_name}'")
        print("\nAvailable models:")
        for name, info in MODELS.items():
            print(f"  - {name}: {info['description']}")
        sys.exit(1)

    model_info = MODELS[model_name]
    repo_id = model_info["repo"]

    # Create output directory
    output_path = Path(output_dir) / model_name
    output_path.mkdir(parents=True, exist_ok=True)

    print(f"📦 Downloading {model_name}...")
    print(f"   Repository: {repo_id}")
    print(f"   Description: {model_info['description']}")
    print(f"   Output: {output_path}")
    print()
    print("This may take a while depending on your internet connection...")
    print()

    try:
        # Download the model
        snapshot_download(
            repo_id=repo_id,
            local_dir=str(output_path),
            local_dir_use_symlinks=False,
            resume_download=True,
        )

        print()
        print("✅ Model downloaded successfully!")
        print(f"   Location: {output_path.absolute()}")
        print()
        print("To use this model, update the MODEL_PATH in:")
        print(f"  - local-agent/.env: MODEL_PATH={output_dir}/{model_name}")
        print(f'  - local-agent/run.py: model_path = "{output_dir}/{model_name}"')

    except Exception as e:
        print(f"\n❌ Error downloading model: {e}")
        sys.exit(1)


def list_models():
    """List available models"""
    print("Available models for download:")
    print()
    for name, info in MODELS.items():
        print(f"  {name}")
        print(f"    Repository: {info['repo']}")
        print(f"    Description: {info['description']}")
        print()


def main():
    parser = argparse.ArgumentParser(
        description="Download Qwen models from Hugging Face"
    )
    parser.add_argument("--model", type=str, help="Model name to download")
    parser.add_argument(
        "--output-dir",
        type=str,
        default="models",
        help="Output directory (default: models)",
    )
    parser.add_argument("--list", action="store_true", help="List available models")

    args = parser.parse_args()

    if args.list:
        list_models()
        return

    if not args.model:
        list_models()
        print("Usage:")
        print(f"  python {sys.argv[0]} --model <model_name>")
        print(f"  python {sys.argv[0]} --list")
        sys.exit(1)

    download_model(args.model, args.output_dir)


if __name__ == "__main__":
    main()
