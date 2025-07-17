import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Bot, Key, Sparkles, ArrowRight, Send, MessageCircle } from 'lucide-react';

interface SidebarProps {
  onGenerate: (prompt: string, apiKey: string) => void;
  isGenerating: boolean;
  onRefineChat: (message: string) => void;
}

const promptExamples = [
  "Hero Section",
  "Pricing Cards", 
  "Music Player",
  "Dashboard",
  "Login Form"
];

const suggestedPrompts = [
  "A brutalist-inspired hero section with geometric shapes...",
  "An interactive pricing table with hover effects...",
  "A minimalist music player with wave animations...",
  "A futuristic dashboard with glowing elements...",
  "A retro-style landing page with neon colors..."
];

export function Sidebar({ onGenerate, isGenerating, onRefineChat }: SidebarProps) {
  const [apiKey, setApiKey] = useLocalStorage('cerebras_api_key', '');
  const [prompt, setPrompt] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);

  const handleGenerate = useCallback(() => {
    if (!apiKey.trim()) {
      alert('Please enter your Cerebras API key');
      return;
    }
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }
    onGenerate(prompt, apiKey);
  }, [apiKey, prompt, onGenerate]);

  const handleChatSubmit = useCallback(() => {
    if (!chatMessage.trim()) return;
    onRefineChat(chatMessage);
    setChatMessage('');
  }, [chatMessage, onRefineChat]);

  const insertExample = (example: string) => {
    setPrompt(example);
  };

  // Cycle through suggestions every 3 seconds
  useState(() => {
    const interval = setInterval(() => {
      setCurrentSuggestionIndex((prev) => (prev + 1) % suggestedPrompts.length);
    }, 3000);
    return () => clearInterval(interval);
  });

  return (
    <motion.div 
      className="w-80 flex-shrink-0 glass-panel border-r border-white/10 flex flex-col"
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Header */}
      <motion.div 
        className="p-6 border-b border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <motion.div 
            className="w-10 h-10 bg-gradient-to-r from-primary to-orange-600 rounded-xl flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bot className="text-white text-lg" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold">RAJAI</h1>
            <p className="text-xs text-muted-foreground">AI Code Generation</p>
          </div>
        </div>

        {/* API Key Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium block">Cerebras API Key</label>
          <div className="relative">
            <Input
              type="password"
              placeholder="Enter your API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-black/50 border-white/20 focus:border-primary pr-10"
            />
            <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          </div>
          <p className="text-xs text-muted-foreground">Stored securely in your browser</p>
        </div>
      </motion.div>

      {/* Prompt Composer */}
      <motion.div 
        className="flex-1 p-6 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="space-y-3">
          <label className="text-sm font-medium block">Describe Your Component</label>
          
          {/* Quick Examples */}
          <div className="flex flex-wrap gap-2 mb-3">
            {promptExamples.map((example, index) => (
              <motion.div key={example}>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-white/10 transition-colors magnetic-hover text-xs"
                  onClick={() => insertExample(example)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {example}
                </Badge>
              </motion.div>
            ))}
          </div>

          <div className="relative">
            <Textarea
              placeholder={suggestedPrompts[currentSuggestionIndex]}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-32 bg-black/50 border-white/20 focus:border-primary resize-none"
              maxLength={500}
            />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
              {prompt.length}/500
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !apiKey.trim() || !prompt.trim()}
            className="w-full bg-gradient-to-r from-primary to-orange-600 text-white font-semibold py-4 px-6 magnetic-hover group"
            size="lg"
          >
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>{isGenerating ? 'Generating...' : 'Generate 5 Variations'}</span>
              <motion.div
                animate={{ x: isGenerating ? 0 : [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </div>
          </Button>
        </motion.div>

        {/* Generation Progress */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div className="text-sm font-medium flex items-center space-x-2">
                <motion.div 
                  className="w-2 h-2 bg-primary rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span>Generating Variations...</span>
              </div>
              
              {/* Progress bars would be mapped from actual generation progress */}
              {[1, 2, 3, 4, 5].map((index) => (
                <motion.div 
                  key={index}
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex justify-between text-xs">
                    <span>Variation {index}</span>
                    <span className="text-primary">Generating...</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1">
                    <motion.div 
                      className="bg-gradient-to-r from-primary to-orange-600 h-1 rounded-full progress-glow"
                      initial={{ width: 0 }}
                      animate={{ width: '65%' }}
                      transition={{ duration: 2, delay: index * 0.2 }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat Interface */}
      <motion.div 
        className="border-t border-white/10 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
          <MessageCircle className="h-4 w-4" />
          <span>Refine Selected Variation</span>
        </div>
        <div className="relative flex space-x-2">
          <Input
            type="text"
            placeholder="Ask for changes..."
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            className="flex-1 bg-black/50 border-white/20 focus:border-primary"
            onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
          />
          <Button
            size="sm"
            onClick={handleChatSubmit}
            disabled={!chatMessage.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
