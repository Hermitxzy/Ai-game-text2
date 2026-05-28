
# ST语言编程助手

一个用于ST语言(Structured Text)的AI编程助手，帮助你编写和理解IEC 61131-3标准的PLC程序。

## 功能特点

- 📖 **ST语言语法指南** - 完整的ST语言语法参考
- 📚 **示例代码库** - 包含常用场景的ST代码示例
- 🤖 **AI助手** - 基于大语言模型的编程助手（支持OpenAI API）
- 💻 **命令行界面** - 简洁美观的终端界面
- 🎯 **本地模式** - 无需API密钥也可以使用本地知识库

## 项目结构

```
/workspace/
├── st_agent.py               # 主程序
├── requirements.txt          # Python依赖
├── .env.example             # 配置文件示例
├── knowledge/
│   ├── __init__.py
│   └── st_language.py       # ST语言知识库
└── README.md                 # 本文档
```

## 快速开始

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 配置环境变量（可选）

如果你想使用完整的AI功能，复制配置文件并填写你的API密钥：

```bash
cp .env.example .env
# 编辑 .env 文件，填入你的 API 密钥
```

### 3. 运行程序

```bash
python st_agent.py
```

## 使用指南

### 可用命令

| 命令 | 说明 |
|------|------|
| `/examples` | 查看所有可用的ST代码示例 |
| `/view <名称>` | 查看指定示例的代码 |
| `/syntax` | 显示ST语言语法指南 |
| `/clear` | 清空对话历史 |
| `/help` | 显示帮助信息 |
| `/exit` | 退出程序 |

### 内置示例

- 启保停电路
- 简单状态机
- 定时器应用
- 模拟量处理
- PID控制

## 配置说明

编辑 `.env` 文件可以配置：

- `OPENAI_API_KEY`: 你的OpenAI API密钥
- `OPENAI_BASE_URL`: API基础URL（可选）
- `MODEL_NAME`: 使用的模型名称（默认gpt-4o）
- `TEMPERATURE`: 温度参数（默认0.7）
- `MAX_TOKENS`: 最大Token数（默认2000）

## 下一步计划

- [ ] 支持更多ST语言特性
- [ ] 添加代码检查和格式化工具
- [ ] 支持梯形图到ST的转换
- [ ] 本地模型集成（Ollama等）
- [ ] Web界面

## 许可证

MIT
