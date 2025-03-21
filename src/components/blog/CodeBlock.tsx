import React, { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-graphql';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  title?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'javascript',
  showLineNumbers = true,
  title,
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: 'تم نسخ الكود',
      description: 'تم نسخ الكود إلى الحافظة',
      duration: 2000,
    });

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-gray-800 bg-gray-900">
      {title && (
        <div className="border-b border-gray-800 bg-gray-950 px-4 py-2 text-sm font-medium text-gray-300">
          {title}
        </div>
      )}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 rounded-md bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
          onClick={copyToClipboard}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
        <pre
          className={`p-4 text-sm ${
            showLineNumbers ? 'line-numbers' : ''
          }`}
        >
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
