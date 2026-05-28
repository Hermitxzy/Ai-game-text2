
#!/usr/bin/env python3
"""
ST语言助手演示脚本
展示如何使用知识库功能
"""

from knowledge.st_language import ST_SYNTAX_GUIDE, EXAMPLES
from rich.console import Console
from rich.panel import Panel
from rich.text import Text

console = Console()

def demo():
    console.print("\n[bold cyan]🤖 ST语言编程助手演示[/]\n")
    
    # 1. 显示语法指南
    console.print("[bold green]1. ST语言语法指南[/]")
    console.print(Panel(ST_SYNTAX_GUIDE[:500] + " ...\n(更多内容请运行主程序查看)", 
                 title="📖 语法指南预览"))
    
    # 2. 显示示例列表
    console.print("\n[bold green]2. 可用示例代码[/]")
    examples_str = "\n".join([f"  • {name}" for name in EXAMPLES.keys()])
    console.print(Panel(examples_str, title="📚 示例库"))
    
    # 3. 显示一个具体示例
    console.print("\n[bold green]3. 示例: 启保停电路[/]")
    console.print(Panel(Text(EXAMPLES["启保停电路"], style="cyan"), 
                 title="📝 启保停电路"))
    
    console.print("\n[bold yellow]💡 提示: 运行 'python st_agent.py' 进入交互式界面![/]\n")

if __name__ == "__main__":
    demo()
