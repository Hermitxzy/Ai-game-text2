
import { useAppStore } from '../store/appStore';
import { BookOpen, Code2, Bot, ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  const { setPage } = useAppStore();

  const features = [
    {
      icon: BookOpen,
      title: '语法指南',
      description: '完整的ST语言语法参考，从基础到高级，助你快速入门',
      action: () => setPage('syntax'),
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Code2,
      title: '示例代码',
      description: '5个实用示例，涵盖启保停、状态机、定时器等常见场景',
      action: () => setPage('examples'),
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Bot,
      title: 'AI助手',
      description: '与AI对话，获取代码建议、解答问题，提升开发效率',
      action: () => setPage('assistant'),
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">无需Python环境，开箱即用</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-orange-400 bg-clip-text text-transparent">
              ST语言编程助手
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            专为PLC编程工程师打造的学习和开发工具。从语法学习到代码生成，一站式解决ST语言编程问题。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setPage('syntax')}
              className="group inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-900/20 hover:-translate-y-0.5"
            >
              <span>开始学习</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setPage('examples')}
              className="inline-flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 border border-gray-700"
            >
              <Code2 className="w-5 h-5" />
              <span>查看示例</span>
            </button>
          </div>
        </div>

        {/* Grid Background */}
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }} />
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <button
                key={index}
                onClick={feature.action}
                className="group text-left bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-6">{feature.description}</p>
                <div className="flex items-center text-blue-400 group-hover:text-blue-300 font-medium">
                  <span>立即体验</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Info Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">什么是ST语言？</h2>
          <p className="text-gray-400 mb-4">
            ST语言（Structured Text）是符合IEC 61131-3标准的高级编程语言，专为工业自动化和PLC编程设计。
            它的语法类似于Pascal和C，是结构化编程的理想选择。
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <div>
                <h4 className="text-white font-medium">结构化编程</h4>
                <p className="text-gray-500 text-sm">支持条件、循环、函数等结构化特性</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
              <div>
                <h4 className="text-white font-medium">IEC 61131-3标准</h4>
                <p className="text-gray-500 text-sm">国际标准，广泛支持于各品牌PLC</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
