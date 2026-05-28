
export interface SyntaxSection {
  id: string;
  title: string;
  description: string;
  code: string;
}

export interface Example {
  id: string;
  title: string;
  description: string;
  code: string;
  category: string;
}

export const syntaxGuide: SyntaxSection[] = [
  {
    id: 'variables',
    title: '变量声明',
    description: 'ST语言中的变量声明，包括VAR、VAR_INPUT、VAR_OUTPUT等变量类型',
    code: `PROGRAM VariableExample
VAR
    // 局部变量
    nCounter : INT := 0;
    bEnable : BOOL := TRUE;
    rTemperature : REAL := 25.0;
END_VAR

VAR_INPUT
    // 输入变量
    nStartSignal : BOOL;
END_VAR

VAR_OUTPUT
    // 输出变量
    bMotorRunning : BOOL;
END_VAR

VAR_IN_OUT
    // 输入输出变量
    rProcessValue : REAL;
END_VAR`
  },
  {
    id: 'data-types',
    title: '数据类型',
    description: 'ST语言支持的基本数据类型',
    code: `// 布尔类型
VAR
    bFlag : BOOL := TRUE;
END_VAR

// 整数类型
VAR
    nIntValue : INT := 100;      // 16位整数 (-32768 ~ 32767)
    nDIntValue : DINT := 100000; // 32位整数
END_VAR

// 实数类型
VAR
    rRealValue : REAL := 3.14;   // 32位浮点数
    rLRealValue : LREAL := 3.1415926535; // 64位浮点数
END_VAR

// 字符串类型
VAR
    sText : STRING[50] := 'Hello';
END_VAR

// 时间类型
VAR
    tDelay : TIME := T#5S;
    dtDateTime : DATE_AND_TIME := DT#2024-01-01-12:00:00;
END_VAR`
  },
  {
    id: 'operators',
    title: '运算符',
    description: '算术、逻辑和比较运算符',
    code: `PROGRAM OperatorExample
VAR
    nA : INT := 10;
    nB : INT := 3;
    nResult : INT;
    bFlag : BOOL;
END_VAR

// 算术运算符
nResult := nA + nB;  // 加法
nResult := nA - nB;  // 减法
nResult := nA * nB;  // 乘法
nResult := nA / nB;  // 除法
nResult := nA MOD nB; // 取模

// 逻辑运算符
bFlag := TRUE AND FALSE; // 与
bFlag := TRUE OR FALSE;  // 或
bFlag := NOT TRUE;       // 非

// 比较运算符
bFlag := nA > nB;   // 大于
bFlag := nA >= nB;  // 大于等于
bFlag := nA = nB;   // 等于
bFlag := nA < nB;   // 小于
bFlag := nA <= nB;  // 小于等于
bFlag := nA <> nB;  // 不等于
END_PROGRAM`
  },
  {
    id: 'if-else',
    title: 'IF条件语句',
    description: '条件判断语句的使用',
    code: `PROGRAM IfElseExample
VAR
    nTemperature : INT := 25;
    bFanOn : BOOL := FALSE;
    bHeaterOn : BOOL := FALSE;
END_VAR

IF nTemperature > 30 THEN
    bFanOn := TRUE;
    bHeaterOn := FALSE;
ELSIF nTemperature < 18 THEN
    bFanOn := FALSE;
    bHeaterOn := TRUE;
ELSE
    bFanOn := FALSE;
    bHeaterOn := FALSE;
END_IF;
END_PROGRAM`
  },
  {
    id: 'case',
    title: 'CASE语句',
    description: '多分支选择语句',
    code: `PROGRAM CaseExample
VAR
    nState : INT := 0;
    bMotor1 : BOOL := FALSE;
    bMotor2 : BOOL := FALSE;
END_VAR

CASE nState OF
    0: // 待机状态
        bMotor1 := FALSE;
        bMotor2 := FALSE;
    1: // 启动阶段1
        bMotor1 := TRUE;
    2: // 启动阶段2
        bMotor1 := TRUE;
        bMotor2 := TRUE;
    ELSE // 错误状态
        bMotor1 := FALSE;
        bMotor2 := FALSE;
END_CASE;
END_PROGRAM`
  },
  {
    id: 'loops',
    title: '循环语句',
    description: 'FOR、WHILE和REPEAT循环',
    code: `PROGRAM LoopExample
VAR
    nIndex : INT;
    nSum : INT := 0;
    nArray : ARRAY[1..5] OF INT := [1, 2, 3, 4, 5];
END_VAR

// FOR循环
nSum := 0;
FOR nIndex := 1 TO 5 DO
    nSum := nSum + nArray[nIndex];
END_FOR;

// WHILE循环
nIndex := 1;
nSum := 0;
WHILE nIndex <= 5 DO
    nSum := nSum + nArray[nIndex];
    nIndex := nIndex + 1;
END_WHILE;

// REPEAT循环
nIndex := 1;
nSum := 0;
REPEAT
    nSum := nSum + nArray[nIndex];
    nIndex := nIndex + 1;
UNTIL nIndex > 5;
END_REPEAT;
END_PROGRAM`
  },
  {
    id: 'functions',
    title: '函数和功能块',
    description: 'FUNCTION和FUNCTION_BLOCK的定义和使用',
    code: `// 函数 - 无状态，有返回值
FUNCTION AddNumbers : INT
VAR_INPUT
    nA : INT;
    nB : INT;
END_VAR
    AddNumbers := nA + nB;
END_FUNCTION

// 功能块 - 有状态
FUNCTION_BLOCK Counter
VAR_INPUT
    bCount : BOOL;
    bReset : BOOL;
END_VAR
VAR_OUTPUT
    nValue : INT := 0;
END_VAR
VAR
    bLastCount : BOOL := FALSE;
END_VAR

IF bReset THEN
    nValue := 0;
ELSIF bCount AND NOT bLastCount THEN
    nValue := nValue + 1;
END_IF;

bLastCount := bCount;
END_FUNCTION_BLOCK

// 使用示例
PROGRAM FunctionExample
VAR
    fbCounter : Counter;
    nResult : INT;
END_VAR

fbCounter(bCount := TRUE, bReset := FALSE);
nResult := fbCounter.nValue;
nResult := AddNumbers(5, 3);
END_PROGRAM`
  }
];

export const examples: Example[] = [
  {
    id: 'start-stop',
    title: '启保停电路',
    description: '经典的电机启动保持停止控制电路',
    category: '基础控制',
    code: `PROGRAM StartStopCircuit
VAR_INPUT
    bStartBtn : BOOL; // 启动按钮（常开）
    bStopBtn : BOOL;  // 停止按钮（常闭）
END_VAR
VAR_OUTPUT
    bMotor : BOOL;    // 电机输出
END_VAR
VAR
    bMotorState : BOOL := FALSE;
END_VAR

// 启保停逻辑
bMotorState := (bStartBtn OR bMotorState) AND bStopBtn;
bMotor := bMotorState;
END_PROGRAM`
  },
  {
    id: 'state-machine',
    title: '简单状态机',
    description: '使用CASE语句实现的多状态控制系统',
    category: '状态控制',
    code: `PROGRAM SimpleStateMachine
VAR_INPUT
    bStart : BOOL;
    bSensor1 : BOOL;
    bSensor2 : BOOL;
END_VAR
VAR_OUTPUT
    bValve1 : BOOL;
    bValve2 : BOOL;
    bPump : BOOL;
END_VAR
VAR
    nState : INT := 0;
    tTimer : TON;
END_VAR

CASE nState OF
    0: // 待机状态
        bValve1 := FALSE;
        bValve2 := FALSE;
        bPump := FALSE;
        IF bStart THEN
            nState := 1;
        END_IF;
    1: // 注水阶段
        bValve1 := TRUE;
        IF bSensor1 THEN
            nState := 2;
        END_IF;
    2: // 搅拌阶段
        bValve1 := FALSE;
        bPump := TRUE;
        tTimer(IN := TRUE, PT := T#10S);
        IF tTimer.Q THEN
            nState := 3;
            tTimer(IN := FALSE);
        END_IF;
    3: // 排水阶段
        bPump := FALSE;
        bValve2 := TRUE;
        IF NOT bSensor2 THEN
            nState := 0;
        END_IF;
END_CASE;
END_PROGRAM`
  },
  {
    id: 'timer',
    title: '定时器应用',
    description: 'TON、TOF、TP定时器的综合应用示例',
    category: '时间控制',
    code: `PROGRAM TimerExample
VAR_INPUT
    bStart : BOOL;
END_VAR
VAR_OUTPUT
    bLamp1 : BOOL;
    bLamp2 : BOOL;
    bLamp3 : BOOL;
END_VAR
VAR
    fbTON : TON;    // 接通延时
    fbTOF : TOF;    // 断开延时
    fbTP : TP;      // 脉冲定时器
END_VAR

// TON - 接通延时
fbTON(IN := bStart, PT := T#3S);
bLamp1 := fbTON.Q;

// TOF - 断开延时
fbTOF(IN := bStart, PT := T#5S);
bLamp2 := fbTOF.Q;

// TP - 脉冲定时器
fbTP(IN := bStart, PT := T#2S);
bLamp3 := fbTP.Q;
END_PROGRAM`
  },
  {
    id: 'analog-processing',
    title: '模拟量处理',
    description: '模拟量信号的采集、滤波和缩放处理',
    category: '模拟量',
    code: `PROGRAM AnalogProcessing
VAR_INPUT
    rRawInput : REAL; // 原始模拟量输入 (0-27648)
END_VAR
VAR_OUTPUT
    rScaledValue : REAL; // 工程值
    rFilteredValue : REAL; // 滤波后的值
END_VAR
VAR
    rFilterBuffer : ARRAY[1..5] OF REAL;
    nIndex : INT := 1;
    rSum : REAL;
    i : INT;
END_VAR

// 1. 缩放处理 (0-27648 -> 0-100.0)
rScaledValue := (rRawInput / 27648.0) * 100.0;

// 2. 移动平均滤波
rFilterBuffer[nIndex] := rScaledValue;
nIndex := nIndex + 1;
IF nIndex > 5 THEN
    nIndex := 1;
END_IF;

rSum := 0.0;
FOR i := 1 TO 5 DO
    rSum := rSum + rFilterBuffer[i];
END_FOR;
rFilteredValue := rSum / 5.0;
END_PROGRAM`
  },
  {
    id: 'pid-control',
    title: 'PID控制',
    description: '简单的PID控制器实现',
    category: '高级控制',
    code: `FUNCTION_BLOCK PID_Controller
VAR_INPUT
    rSetpoint : REAL;     // 设定值
    rProcessValue : REAL; // 过程值
    bEnable : BOOL;       // 使能
END_VAR
VAR_OUTPUT
    rOutput : REAL := 0.0;
END_VAR
VAR
    rKp : REAL := 1.0;    // 比例系数
    rKi : REAL := 0.1;    // 积分系数
    rKd : REAL := 0.01;   // 微分系数
    rError : REAL;
    rLastError : REAL := 0.0;
    rIntegral : REAL := 0.0;
    rDerivative : REAL;
    rOutputMin : REAL := -100.0;
    rOutputMax : REAL := 100.0;
END_VAR

IF bEnable THEN
    // 计算误差
    rError := rSetpoint - rProcessValue;
    
    // 积分项
    rIntegral := rIntegral + rError;
    
    // 微分项
    rDerivative := rError - rLastError;
    
    // PID输出
    rOutput := rKp * rError + rKi * rIntegral + rKd * rDerivative;
    
    // 输出限幅
    IF rOutput > rOutputMax THEN
        rOutput := rOutputMax;
    ELSIF rOutput < rOutputMin THEN
        rOutput := rOutputMin;
    END_IF;
    
    rLastError := rError;
ELSE
    rIntegral := 0.0;
    rOutput := 0.0;
END_IF;
END_FUNCTION_BLOCK`
  }
];

export const systemPrompt = `你是一个专业的ST语言（Structured Text）编程助手。ST语言是符合IEC 61131-3标准的PLC编程语言。

你的职责：
1. 解释ST语言的语法和概念
2. 提供ST语言代码示例
3. 帮助调试和优化ST代码
4. 解释PLC编程的最佳实践
5. 回答关于IEC 61131-3标准的问题

请用专业但易懂的语言回答，并提供完整、可运行的代码示例。`;
