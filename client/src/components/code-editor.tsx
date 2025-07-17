import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  Copy, 
  Download, 
  Play, 
  Scale, 
  GitBranch,
  Eye,
  EyeOff 
} from 'lucide-react';
import type { CodeVariation } from '@/types';

interface CodeEditorProps {
  variation?: CodeVariation;
  onRunPlayground?: () => void;
  onCompare?: () => void;
  onFork?: () => void;
}

export function CodeEditor({ 
  variation, 
  onRunPlayground, 
  onCompare, 
  onFork 
}: CodeEditorProps) {
  const [showPreview, setShowPreview] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!variation?.code) return;

    try {
      await navigator.clipboard.writeText(variation.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    if (!variation?.code) return;

    const blob = new Blob([variation.code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `variation-${variation.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatCode = (code: string) => {
    // Basic syntax highlighting for HTML
    return code
      .replace(/(&lt;)([^&\s]*?)(\s[^&]*?)?(&gt;)/g, '<span class="text-blue-400">$1$2</span><span class="text-green-400">$3</span><span class="text-blue-400">$4</span>')
      .replace(/(&quot;[^&]*?&quot;)/g, '<span class="text-orange-300">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500">$1</span>')
      .replace(/(\/\/.*$)/gm, '<span class="text-gray-500">$1</span>');
  };

  if (!variation) {
    return (
      <motion.div 
        className="w-1/3 glass-panel border-l border-white/10 flex flex-col items-center justify-center"
        initial={{ x: 320, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Code className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-center">
          Select a variation to view its code
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="w-1/3 glass-panel border-l border-white/10 flex flex-col"
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Code className="text-primary h-5 w-5" />
          <span className="font-medium">Code Editor</span>
          <Badge variant="outline" className="text-xs">
            {variation.style}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowPreview(!showPreview)}
            className="p-1.5"
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="p-1.5"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDownload}
            className="p-1.5"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Code/Preview Toggle */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {showPreview && variation.code ? (
          <div className="flex-1 p-4">
            <div className="h-full bg-black/30 rounded-lg overflow-hidden">
              <iframe
                srcDoc={variation.code}
                className="w-full h-full"
                sandbox="allow-scripts allow-same-origin"
                title="Code Preview"
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <div className="h-full bg-black/30 code-editor text-sm">
              <div className="p-4 space-y-1 text-xs font-mono">
                {variation.code ? (
                  <pre className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                    <code dangerouslySetInnerHTML={{ 
                      __html: formatCode(variation.code.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'))
                    }} />
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Code className="h-8 w-8" />
                    </motion.div>
                  </div>
                )}

                {variation.status === 'generating' && (
                  <motion.div
                    className="inline-block w-2 h-4 bg-primary ml-1"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Copy notification */}
      {copied && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-20 right-4 bg-green-500 text-white px-3 py-2 rounded-lg text-sm"
        >
          Code copied to clipboard!
        </motion.div>
      )}

      {/* Code Actions */}
      <div className="p-4 border-t border-white/10 space-y-3">
        <Button
          onClick={onRunPlayground}
          className="w-full bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 magnetic-hover"
          variant="outline"
        >
          <Play className="h-4 w-4 mr-2" />
          Run in Playground
        </Button>

        <div className="flex space-x-2">
          <Button
            onClick={onCompare}
            variant="outline"
            size="sm"
            className="flex-1 bg-white/5 border-white/10 hover:bg-white/10"
          >
            <Scale className="h-4 w-4 mr-2" />
            Compare
          </Button>
          <Button
            onClick={onFork}
            variant="outline"
            size="sm"
            className="flex-1 bg-white/5 border-white/10 hover:bg-white/10"
          >
            <GitBranch className="h-4 w-4 mr-2" />
            Fork
          </Button>
        </div>
      </div>
    </motion.div>
  );
}