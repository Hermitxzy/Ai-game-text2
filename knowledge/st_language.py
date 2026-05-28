
"""
ST语言知识库
包含ST语言的语法规则、示例代码和最佳实践
"""

SYSTEM_PROMPT = """你是一位专业的ST语言(Structured Text)编程助手，精通IEC 61131-3标准。
你需要帮助用户：
1. 解释ST语言语法和特性
2. 编写和优化ST代码
3. 调试ST程序
4. 提供ST语言最佳实践
5. 将梯形图转换为ST语言

请始终以专业、清晰的方式回答，并提供具体的代码示例。
"""

ST_SYNTAX_GUIDE = """
# ST语言(Structured Text)语法指南

## 基本语法特点：
- 赋值运算符: :=
- 比较运算符: =, &lt;&gt;, &lt;, &gt;, &lt;=, &gt;=
- 逻辑运算符: AND, OR, NOT
- 语句结束: ;
- 注释: (* 多行注释 *) 或 // 单行注释

## 数据类型：
- BOOL: 布尔值 TRUE/FALSE
- INT: 整数
- REAL: 实数
- TIME: 时间类型 t#5s, t#20ms
- STRING: 字符串

## 控制结构：

### IF语句
IF condition THEN
    (* 语句;
ELSIF condition2 THEN
    (* 语句;
ELSE
    (* 语句;
END_IF;

### CASE语句
CASE variable OF
    value1: 语句;
    value2, value3: 语句;
    value4..value10: 语句;
ELSE
    语句;
END_CASE;

### FOR循环
FOR i := 1 TO 10 BY 1 DO
    语句;
END_FOR;

### WHILE循环
WHILE condition DO
    语句;
END_WHILE;

### REPEAT循环
REPEAT
    语句;
UNTIL condition;
END_REPEAT;
"""

EXAMPLES = {
    "启保停电路": '''
(* 经典启保停电路ST实现
*)
VAR
    StartButton AT %IX0.0: BOOL;
    StopButton AT %IX0.1: BOOL;
    Motor AT %QX0.0: BOOL;
END_VAR

IF NOT StopButton THEN
    Motor := StartButton OR Motor;
END_IF;
''',
    
    "简单状态机": '''
(* 简单状态机示例
*)
VAR
    StateMachine: INT := 0;
    Sensor1 AT %IX0.0: BOOL;
    Sensor2 AT %IX0.1: BOOL;
    Valve AT %QX0.0: BOOL;
END_VAR

CASE StateMachine OF
    0: (* 待机状态
        IF Sensor1 THEN
            StateMachine := 1;
        END_IF;
    1: (* 运行状态
        Valve := TRUE;
        IF Sensor2 THEN
            StateMachine := 2;
        END_IF;
    2: (* 完成状态
        Valve := FALSE;
        StateMachine := 0;
END_CASE;
''',
    
    "定时器应用": '''
(* 定时器使用示例
*)
VAR
    MyTimer: TP;
    StartTimer AT %IX0.0: BOOL;
    TimerDone AT %QX0.0: BOOL;
END_VAR

MyTimer(IN := StartTimer, PT := T#5S);
TimerDone := MyTimer.Q;
''',
    
    "模拟量处理": '''
(* 模拟量数据处理
*)
VAR
    RawValue AT %IW0: INT;
    ScaledValue: REAL;
    SetPoint: REAL := 25.0;
    Output AT %QW0: INT;
END_VAR

(* 模拟量缩放 0-32767 转换为 0.0-100.0 *)
ScaledValue := (RawValue / 327.67;

(* 简单的比例控制 *)
IF ScaledValue &lt; SetPoint THEN
    Output := INT_TO_WORD(TO_INT((SetPoint - ScaledValue) * 100);
ELSE
    Output := 0;
END_IF;
''',
    
    "PID控制": '''
(* PID控制算法实现
*)
VAR
    SetPoint: REAL := 50.0;
    ProcessValue AT %IW0: INT;
    Kp: REAL := 1.0;
    Ki: REAL := 0.1;
    Kd: REAL := 0.01;
    Error: REAL;
    LastError: REAL := 0.0;
    Integral: REAL := 0.0;
    Derivative: REAL;
    Output AT %QW0: INT;
END_VAR

Error := SetPoint - INT_TO_REAL(ProcessValue);
Integral := Integral + Error;
Derivative := Error - LastError;
Output := REAL_TO_WORD(TO_INT(Kp * Error + Ki * Integral + Kd * Derivative));
LastError := Error;
'''
}
