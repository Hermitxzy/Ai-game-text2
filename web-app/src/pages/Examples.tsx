
import { useState } from 'react';
import { examples } from '../data/stKnowledge';
import CodeBlock from '../components/CodeBlock';
import { Code2, X, Tag } from 'lucide-react';

export default function Examples() {
  const [selectedExample, setSelectedExample] = useState<typeof examples[0] | null>(null);

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center space-x-3 mb-4">
            <Code2 className="w-8 h-8 text-green-400" />
            <h1 className="text-3xl font-bold text-white">示例代码</h1>
          </div>
          <p className="text-gray-400">
            5个实用示例，涵盖常见PLC编程场景，助你快速上手
          </p>
        </div>

        {/* Example Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {examples.map((example) => (
            <button
              key={example.id}
              onClick={() => setSelectedExample(example)}
              className="group text-left bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center space-x-2 mb-3">
                <Tag className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-medium text-orange-400 uppercase tracking-wider">
                  {example.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {example.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4">{example.description}</p>
              <div className="text-blue-400 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                查看代码 →
              </div>
            </button>
          ))}
        </div>

        {/* Modal for selected example */}
        {selectedExample && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Tag className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-medium text-orange-400 uppercase tracking-wider">
                      {selectedExample.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{selectedExample.title}</h2>
                  <p className="text-gray-400 mt-1">{selectedExample.description}</p>
                </div>
                <button
                  onClick={() => setSelectedExample(null)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <CodeBlock code={selectedExample.code} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
