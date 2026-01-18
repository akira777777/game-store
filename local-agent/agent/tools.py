"""
Tool Executor - executes shell, git, and Python commands
"""

import asyncio
import json
import logging
import os
import subprocess
import sys
from typing import Any, Dict, List, Optional, Union
from dataclasses import dataclass
from pathlib import Path

logger = logging.getLogger(__name__)


@dataclass
class ToolResult:
    """Result from tool execution"""
    success: bool
    output: str
    error: Optional[str] = None
    return_code: Optional[int] = None


class ToolExecutor:
    """Executor for various tools (shell, git, python)"""
    
    def __init__(self, working_dir: Optional[str] = None):
        """
        Initialize tool executor
        
        Args:
            working_dir: Optional working directory for commands
        """
        self.working_dir = working_dir or os.getcwd()
        self.tools = {
            "shell": self._execute_shell,
            "git": self._execute_git,
            "python": self._execute_python,
        }
    
    def get_tool_descriptions(self) -> Dict[str, str]:
        """Get descriptions of available tools"""
        return {
            "shell": "Execute shell commands (e.g., ls, mkdir, npm install)",
            "git": "Execute git commands (e.g., git status, git commit, git push)",
            "python": "Execute Python code or scripts"
        }
    
    async def execute_tool(self, tool_name: str, arguments: Dict[str, Any]) -> ToolResult:
        """
        Execute a tool with given arguments
        
        Args:
            tool_name: Name of the tool to execute
            arguments: Arguments for the tool
            
        Returns:
            ToolResult containing execution result
        """
        if tool_name not in self.tools:
            return ToolResult(
                success=False,
                output="",
                error=f"Unknown tool: {tool_name}"
            )
        
        try:
            result = await self.tools[tool_name](arguments)
            return result
        except Exception as e:
            logger.error(f"Error executing tool {tool_name}: {e}")
            return ToolResult(
                success=False,
                output="",
                error=str(e)
            )
    
    async def _execute_shell(self, arguments: Dict[str, Any]) -> ToolResult:
        """
        Execute shell command
        
        Args:
            arguments: {
                "command": str,  # The shell command to execute
                "timeout": Optional[int] = 60  # Optional timeout in seconds
            }
        """
        command = arguments.get("command")
        timeout = arguments.get("timeout", 60)
        
        if not command:
            return ToolResult(
                success=False,
                output="",
                error="No command provided"
            )
        
        try:
            # Execute command
            process = await asyncio.create_subprocess_shell(
                command,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                cwd=self.working_dir
            )
            
            stdout, stderr = await asyncio.wait_for(
                process.communicate(),
                timeout=timeout
            )
            
            output = stdout.decode('utf-8', errors='ignore')
            error = stderr.decode('utf-8', errors='ignore') if stderr else ""
            
            return ToolResult(
                success=True,
                output=output,
                error=error if error else None,
                return_code=process.returncode
            )
            
        except asyncio.TimeoutError:
            return ToolResult(
                success=False,
                output="",
                error=f"Command timed out after {timeout} seconds"
            )
        except Exception as e:
            return ToolResult(
                success=False,
                output="",
                error=str(e)
            )
    
    async def _execute_git(self, arguments: Dict[str, Any]) -> ToolResult:
        """
        Execute git command
        
        Args:
            arguments: {
                "command": str,  # Git command (e.g., "status", "commit -m 'message'", "push")
                "timeout": Optional[int] = 60
            }
        """
        git_command = arguments.get("command")
        timeout = arguments.get("timeout", 60)
        
        if not git_command:
            return ToolResult(
                success=False,
                output="",
                error="No git command provided"
            )
        
        # Ensure we're in a git repository
        try:
            git_check = await self._execute_shell({
                "command": "git rev-parse --git-dir",
                "timeout": 10
            })
            
            if not git_check.success:
                return ToolResult(
                    success=False,
                    output="",
                    error="Not in a git repository"
                )
        except:
            return ToolResult(
                success=False,
                output="",
                error="Git repository check failed"
            )
        
        # Execute git command
        return await self._execute_shell({
            "command": f"git {git_command}",
            "timeout": timeout
        })
    
    async def _execute_python(self, arguments: Dict[str, Any]) -> ToolResult:
        """
        Execute Python code or script
        
        Args:
            arguments: {
                "code": Optional[str],  # Python code to execute
                "script_path": Optional[str],  # Path to Python script file
                "timeout": Optional[int] = 60
            }
        """
        code = arguments.get("code")
        script_path = arguments.get("script_path")
        timeout = arguments.get("timeout", 60)
        
        if not code and not script_path:
            return ToolResult(
                success=False,
                output="",
                error="No code or script path provided"
            )
        
        # Prepare execution environment
        env = os.environ.copy()
        env['PYTHONPATH'] = self.working_dir
        
        try:
            if code:
                # Execute Python code directly
                process = await asyncio.create_subprocess_exec(
                    sys.executable, "-c", code,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                    cwd=self.working_dir,
                    env=env
                )
            else:
                # Execute Python script file
                script_path = Path(script_path)
                if not script_path.is_absolute():
                    script_path = Path(self.working_dir) / script_path
                
                if not script_path.exists():
                    return ToolResult(
                        success=False,
                        output="",
                        error=f"Script file not found: {script_path}"
                    )
                
                process = await asyncio.create_subprocess_exec(
                    sys.executable, str(script_path),
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                    cwd=self.working_dir,
                    env=env
                )
            
            stdout, stderr = await asyncio.wait_for(
                process.communicate(),
                timeout=timeout
            )
            
            output = stdout.decode('utf-8', errors='ignore')
            error = stderr.decode('utf-8', errors='ignore') if stderr else ""
            
            return ToolResult(
                success=True,
                output=output,
                error=error if error else None,
                return_code=process.returncode
            )
            
        except asyncio.TimeoutError:
            return ToolResult(
                success=False,
                output="",
                error=f"Python execution timed out after {timeout} seconds"
            )
        except Exception as e:
            return ToolResult(
                success=False,
                output="",
                error=str(e)
            )
    
    def set_working_directory(self, path: str):
        """Set the working directory for commands"""
        self.working_dir = path
        logger.info(f"Working directory set to: {path}")