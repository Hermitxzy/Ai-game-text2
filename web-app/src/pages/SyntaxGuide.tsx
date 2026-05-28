
import { useState } from 'react';
import { syntaxGuide } from '../data/stKnowledge';
import CodeBlock from '../components/CodeBlock';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

export default function SyntaxGuide() {
  const [openSections, setOpenSections] = useState<string[]>([syntaxGuide[0].id]);

  const toggleSection = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center space-x-3 mb-4">
            <BookOpen className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">语法指南</h1>
          </div>
          <p className="text-gray-400">
            完整的ST语言语法参考，从基础到高级，帮助你快速掌握ST语言编程
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {syntaxGuide.map((section) => {
            const isOpen = openSections.includes(section.id);
            return (
              <div
                key={section.id}
                className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-800 transition-colors"
                >
                  <div>
                    <h2 className="text-xl font-bold text-white">{section.title}</h2>
                    <p className="text-gray-400 text-sm mt-1">{section.description}</p>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-6">
                    <div className="border-t border-gray-700 pt-4">
                      <CodeBlock code={section.code} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
