
import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { systemPrompt } from '../data/stKnowledge';
import CodeBlock from '../components/CodeBlock';
import { Bot, User, Send, Settings, MessageSquare, Trash2, Plus, Loader2 } from 'lucide-react';

export default function Assistant() {
  const {
    apiKey,
    baseUrl,
    modelName,
    conversations,
    currentConversationId,
    setApiConfig,
    createConversation,
    addMessage,
    deleteConversation,
    setCurrentConversation,
    resetConfig,
  } = useAppStore();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [tempBaseUrl, setTempBaseUrl] = useState(baseUrl);
  const [tempModelName, setTempModelName] = useState(modelName);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find((c) => c.id === currentConversationId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const handleSaveSettings = () => {
    setApiConfig({ apiKey: tempApiKey, baseUrl: tempBaseUrl, modelName: tempModelName });
    setShowSettings(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    let convId = currentConversationId;
    if (!convId) {
      convId = createConversation();
    }

    const userMessage = input.trim();
    setInput('');
    addMessage(convId, { role: 'user', content: userMessage });

    setIsLoading(true);

    try {
      const conv = conversations.find((c) => c.id === convId);
      const messages = [
        { role: 'system', content: systemPrompt },
        ...(conv?.messages.map((m) => ({ role: m.role, content: m.content })) || []),
        { role: 'user', content: userMessage },
      ];

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: modelName,
          messages,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;

      addMessage(convId, { role: 'assistant', content: assistantMessage });
    } catch (error) {
      addMessage(convId, {
        role: 'assistant',
        content: `抱歉，发生了错误: ${(error as Error).message}。请检查你的API Key和网络连接。`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 简单的Markdown解析，只处理代码块
  const renderMessage = (content: string) => {
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const parts = content.split(codeBlockRegex);
    const result: JSX.Element[] = [];

    let codeMode = false;
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 1) {
        // 代码块
        const code = parts[i];
        const langMatch = code.match(/^(\w+)?\s*([\s\S]*)$/);
        const lang = langMatch?.[1] || 'pascal';
        const actualCode = langMatch?.[2] || code;
        result.push(
          <div key={i} className="my-4">
            <CodeBlock code={actualCode.trim()} language={lang} />
          </div>
        );
      } else if (parts[i]) {
        // 普通文本
        result.push(
          <p key={i} className="whitespace-pre-wrap">
            {parts[i]}
          </p>
        );
      }
    }

    return result.length > 0 ? result : content;
  };

  return (
    <div className="min-h-screen pt-16 flex">
      {/* Sidebar */}
      <div className="hidden md:flex w-72 bg-gray-900 border-r border-gray-800 flex-col">
        <div className="p-4 border-b border-gray-800">
          <button
            onClick={() => createConversation()}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-xl font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>新对话</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setCurrentConversation(conv.id)}
              onDoubleClick={() => {
                if (confirm('确定要删除这个对话吗？')) {
                  deleteConversation(conv.id);
                }
              }}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center space-x-3 group ${
                currentConversationId === conv.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 truncate text-sm">{conv.title}</span>
              {currentConversationId === conv.id && (
                <Trash2
                  className="w-4 h-4 opacity-0 group-hover:opacity-100 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('确定要删除这个对话吗？')) {
                      deleteConversation(conv.id);
                    }
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6">
          <div className="flex items-center space-x-3">
            <Bot className="w-6 h-6 text-orange-400" />
            <h2 className="text-xl font-bold text-white">
              {currentConversation?.title || 'AI助手'}
            </h2>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="border-b border-gray-800 bg-gray-900/50 p-6">
            <h3 className="text-lg font-bold text-white mb-4">API设置</h3>
            <div className="grid gap-4 max-w-2xl">
              <div>
                <label className="block text-sm text-gray-400 mb-2">API Key</label>
                <input
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="sk-..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Base URL</label>
                <input
                  type="text"
                  value={tempBaseUrl}
                  onChange={(e) => setTempBaseUrl(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="https://api.openai.com/v1"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Model</label>
                <input
                  type="text"
                  value={tempModelName}
                  onChange={(e) => setTempModelName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="gpt-4o"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveSettings}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  保存设置
                </button>
                <button
                  onClick={() => {
                    resetConfig();
                    setTempApiKey('');
                    setTempBaseUrl('http://127.0.0.1:8000');
                    setTempModelName('local-model');
                  }}
                  className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  使用本地服务器
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {!currentConversation || currentConversation.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">ST语言编程助手</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                问我任何关于ST语言编程的问题，我会帮助你解答并提供代码示例。
              </p>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 max-w-md">
                <p className="text-blue-300 text-sm">
                  默认使用本地AI服务器。如需使用OpenAI，请点击右上角设置配置API Key。
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {currentConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex space-x-4 ${message.role === 'user' ? 'justify-end' : ''}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-3xl ${
                      message.role === 'user'
                        ? 'bg-blue-600 rounded-2xl rounded-tr-sm'
                        : 'bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-sm'
                    } px-6 py-4`}
                  >
                    <div
                      className={message.role === 'user' ? 'text-white' : 'text-gray-200'}
                    >
                      {renderMessage(message.content)}
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  </div>
                  <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-sm px-6 py-4">
                    <p className="text-gray-400">思考中...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-800 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="输入你的问题..."
                className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-6 py-4 pr-16 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none max-h-40"
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 bottom-2 p-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
