
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import uvicorn

app = FastAPI(title="ST Language AI Assistant", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    model: str
    messages: List[Message]
    temperature: float = 0.7

class ChatResponse(BaseModel):
    id: str
    object: str
    created: int
    model: str
    choices: List[Dict]

def generate_st_response(messages: List[Message]) -> str:
    user_message = messages[-1].content.lower() if messages else ""
    
    responses = {
        "启保停": """以下是一个经典的启保停电路示例：

```st
PROGRAM StartStopCircuit
VAR_INPUT
    bStartBtn : BOOL; // 启动按钮（常开）
    bStopBtn : BOOL;  // 停止按钮（常闭）
END_VAR
VAR_OUTPUT
    bMotor : BOOL;    // 电机输出
END_VAR

bMotor := (bStartBtn OR bMotor) AND bStopBtn;
END_PROGRAM
```

这段代码实现了电机的启动、保持和停止控制逻辑。""",
        
        "定时器": """ST语言中有三种常用的定时器：

**TON (接通延时定时器)**
```st
VAR
    fbTimer : TON;
    bOutput : BOOL;
END_VAR

fbTimer(IN := bStart, PT := T#5S);
bOutput := fbTimer.Q;
```

**TOF (断开延时定时器)**
```st
fbTOF(IN := bInput, PT := T#3S);
```

**TP (脉冲定时器)**
```st
fbTP(IN := bTrigger, PT := T#2S);
```""",
        
        "pid": """以下是一个简单的PID控制器实现：

```st
FUNCTION_BLOCK PID_Controller
VAR_INPUT
    rSetpoint : REAL;
    rProcessValue : REAL;
    bEnable : BOOL;
END_VAR
VAR_OUTPUT
    rOutput : REAL := 0.0;
END_VAR
VAR
    rKp : REAL := 1.0;
    rKi : REAL := 0.1;
    rKd : REAL := 0.01;
    rError : REAL;
    rIntegral : REAL := 0.0;
END_VAR

IF bEnable THEN
    rError := rSetpoint - rProcessValue;
    rIntegral := rIntegral + rError;
    rOutput := rKp * rError + rKi * rIntegral;
END_IF;
END_FUNCTION_BLOCK
```""",
        
        "变量": """ST语言支持多种变量类型：

```st
VAR
    bFlag : BOOL := TRUE;
    nIntValue : INT := 100;
    nDIntValue : DINT := 100000;
    rRealValue : REAL := 3.14;
    sText : STRING[50] := 'Hello';
    tDelay : TIME := T#5S;
END_VAR
```""",
        
        "case": """CASE语句用于多分支选择：

```st
CASE nState OF
    0: 
        bMotor := FALSE;
    1: 
        bMotor := TRUE;
    2: 
        bMotor := FALSE;
    ELSE 
        bMotor := FALSE;
END_CASE;
```""",
    }
    
    for keyword, response in responses.items():
        if keyword in user_message:
            return response
    
    return f"""我来帮你解答关于ST语言的问题！

**你问的问题是:** {messages[-1].content}

ST语言（Structured Text）是符合IEC 61131-3标准的高级PLC编程语言。

**示例代码:**

```st
PROGRAM Example
VAR
    nCounter : INT := 0;
    bEnable : BOOL := TRUE;
END_VAR

IF bEnable THEN
    nCounter := nCounter + 1;
END_IF;
END_PROGRAM
```

如需了解更多，请告诉我！"""

@app.options("/chat/completions")
async def options_chat():
    return {"status": "ok"}

@app.post("/chat/completions", response_model=ChatResponse)
async def chat_completions(request: ChatRequest):
    try:
        response_content = generate_st_response(request.messages)
        
        return ChatResponse(
            id="chatcmpl-test-001",
            object="chat.completion",
            created=1234567890,
            model=request.model,
            choices=[{
                "message": {
                    "role": "assistant",
                    "content": response_content
                },
                "finish_reason": "stop",
                "index": 0
            }]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "ST Language AI Assistant is running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
