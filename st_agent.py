
#!/usr/bin/env python3
"""
ST语言编程助手
一个简单的命令行AI助手，帮助你编写和理解ST语言
"""

import os
import sys
from dotenv import load_dotenv
from openai import OpenAI
from rich.console import Console
from rich.panel import Panel
from rich.markdown import Markdown
from rich.prompt import Prompt, Confirm
from rich.text import Text

from knowledge.st_language import SYSTEM_PROMPT, ST_SYNTAX_GUIDE, EXAMPLES

console = Console()

class STLanguageAgent:
    def __init__(self):
        """初始化ST语言助手"""
        load_dotenv()
        
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
        self.model_name = os.getenv("MODEL_NAME", "gpt-4o")
        self.temperature = float(os.getenv("TEMPERATURE", "0.7"))
        self.max_tokens = int(os.getenv("MAX_TOKENS", "2000"))
        
        self.conversation_history = []
        self.client = None
        
        if self.api_key and self.api_key != "your-api-key-here":
            self.client = OpenAI(
                api_key=self.api_key,
                base_url=self.base_url
            )
            console.print("[green]✓[/] OpenAI API已连接")
        else:
            console.print("[yellow]⚠[/] API密钥未配置，将使用本地模式")
        
        self._init_conversation()
    
    def _init_conversation(self):
        """初始化对话历史"""
        self.conversation_history = [
            {"role": "system", "content": SYSTEM_PROMPT + "\n\n" + ST_SYNTAX_GUIDE}
        ]
    
    def show_welcome(self):
        """显示欢迎界面"""
        welcome_text = """
# ST语言编程助手

欢迎使用 ST 语言助手！我可以帮助你：

1. **解释ST语言语法** - 了解IEC 61131-3标准的ST语言
2. **编写ST代码** - 为PLC项目编写程序
3. **查看示例代码** - 从常见场景中学习
4. **代码优化建议** - 改进你的ST程序
5. **调试帮助** - 找出程序中的问题

输入 `/help` 获取可用命令
"""
        console.print(Panel(Markdown(welcome_text), title="🤖 ST语言助手"))
    
    def get_available_examples(self):
        """获取示例列表"""
        return list(EXAMPLES.keys())
    
    def show_example(self, example_name):
        """显示示例代码"""
        if example_name not in EXAMPLES:
            console.print(f"[red]✗[/] 找不到示例: {example_name}")
            return
        
        console.print(Panel(
            Text(EXAMPLES[example_name], style="cyan"),
            title=f"📝 {example_name}"
        ))
    
    def chat(self, user_input):
        """与AI助手对话"""
        if not self.client:
            console.print("[yellow]⚠[/] 本地模式：未配置API密钥，演示响应")
            return self._demo_response(user_input)
        
        self.conversation_history.append({"role": "user", "content": user_input})
        
        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=self.conversation_history,
                temperature=self.temperature,
                max_tokens=self.max_tokens
            )
            
            assistant_response = response.choices[0].message.content
            self.conversation_history.append({
                "role": "assistant", 
                "content": assistant_response
            })
            
            return assistant_response
            
        except Exception as e:
            console.print(f"[red]✗[/] 错误: {e}")
            return self._demo_response(user_input)
    
    def _demo_response(self, user_input):
        """演示模式响应（无API时）"""
        if "示例" in user_input or "example" in user_input.lower():
            return "您可以使用命令 '/examples' 查看可用示例，使用 '/view 示例名' 查看具体代码。"
        
        return ("在演示模式下，您可以：\n"
                "- 使用 `/examples` 查看示例列表\n"
                "- 使用 `/view 示例名` 查看示例代码\n"
                "- 使用 `/syntax` 查看语法指南\n"
                "配置 .env 文件中的 API 密钥后，可使用完整的 AI 功能。")
    
    def show_help(self):
        """显示帮助信息"""
        help_text = """
## 可用命令

| 命令 | 说明 |
|------|------|
| `/examples` | 查看所有可用的ST代码示例 |
| `/view <名称>` | 查看指定示例的代码 |
| `/syntax` | 显示ST语言语法指南 |
| `/clear` | 清空对话历史 |
| `/help` | 显示帮助信息 |
| `/exit` | 退出程序 |
| 直接输入问题 | 向AI助手提问关于ST语言的问题 |
"""
        console.print(Panel(Markdown(help_text), title="❓ 帮助"))
    
    def show_syntax(self):
        """显示语法指南"""
        console.print(Panel(Markdown(ST_SYNTAX_GUIDE), title="📖 ST语言语法指南"))
    
    def show_examples_list(self):
        """显示示例列表"""
        examples_str = "\n".join([f"  • {name}" for name in EXAMPLES.keys()])
        console.print(Panel(examples_str, title="📚 可用示例"))
    
    def clear_conversation(self):
        """清空对话历史"""
        self._init_conversation()
        console.print("[green]✓[/] 对话历史已清空")
    
    def run(self):
        """运行主循环"""
        self.show_welcome()
        
        while True:
            try:
                user_input = Prompt.ask("[bold blue]\n你[/]").strip()
                
                if not user_input:
                    continue
                
                if user_input in ["/exit", "/quit", "q"]:
                    console.print("[green]再见！[/]")
                    break
                
                elif user_input == "/help":
                    self.show_help()
                
                elif user_input == "/examples":
                    self.show_examples_list()
                
                elif user_input.startswith("/view "):
                    example_name = user_input[6:].strip()
                    self.show_example(example_name)
                
                elif user_input == "/syntax":
                    self.show_syntax()
                
                elif user_input == "/clear":
                    self.clear_conversation()
                
                else:
                    with console.status("[bold green]思考中..."):
                        response = self.chat(user_input)
                    
                    console.print("\n[bold cyan]助手[/]:")
                    console.print(Panel(response))
            
            except KeyboardInterrupt:
                console.print("\n[yellow]中断[/]，输入 /exit 退出")
            except Exception as e:
                console.print(f"[red]错误:[/] {e}")


def main():
    agent = STLanguageAgent()
    agent.run()


if __name__ == "__main__":
    main()
