
import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-pascal';
import 'prismjs/themes/prism-tomorrow.css';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language = 'pascal' }: CodeBlockProps) {
  const codeRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
      >
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-300" />}
      </button>
      <pre className="!m-0 !p-4 rounded-xl overflow-x-auto">
        <code ref={codeRef} className={`language-${language} text-sm`}>
          {code}
        </code>
      </pre>
    </div>
  );
}
