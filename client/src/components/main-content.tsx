import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PreviewCard } from './preview-card';
import { CodeEditor } from './code-editor';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Download, 
  GitBranch, 
  User, 
  Zap,
  Settings,
  History,
  Plus,
  Menu,
  X
} from 'lucide-react';
import type { CodeVariation } from '@/types';

interface MainContentProps {
  variations: CodeVariation[];
  isGenerating: boolean;
  onExportZip?: () => void;
  onCreateGist?: () => void;
  onToggleSidebar?: () => void;
}

export function MainContent({ 
  variations, 
  isGenerating, 
  onExportZip, 
  onCreateGist,
  onToggleSidebar 
}: MainContentProps) {
  const [selectedVariation, setSelectedVariation] = useState<CodeVariation | undefined>();
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const isMobile = useIsMobile();

  const handleVariationSelect = useCallback((variation: CodeVariation) => {
    setSelectedVariation(variation);
    if (isMobile) {
      setShowCodeEditor(true);
    }
  }, [isMobile]);

  const completedVariations = variations.filter(v => v.status === 'completed' || v.code);
  const hasVariations = variations.length > 0;

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Navigation */}
      <motion.div 
        className="glass-panel border-b border-white/10 px-4 sm:px-6 py-4"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-6">
            {/* Mobile menu button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleSidebar}
                className="p-1 hover:bg-white/10"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <div className="text-sm">
              <span className="text-muted-foreground hidden sm:inline">Project:</span>
              <span className="ml-0 sm:ml-2 font-medium">Untitled Generation</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <motion.div 
                className={`w-2 h-2 rounded-full ${completedVariations.length > 0 ? 'bg-green-500' : 'bg-yellow-500'}`}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="hidden sm:inline">
                {isGenerating 
                  ? `${completedVariations.length}/5 variations ready`
                  : `${completedVariations.length} variations ready`
                }
              </span>
              <span className="sm:hidden">
                {completedVariations.length}/5
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Export Options */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button
                onClick={onExportZip}
                disabled={completedVariations.length === 0}
                size="sm"
                variant="outline"
                className="bg-white/5 border-white/10 hover:bg-white/10 magnetic-hover"
              >
                <Download className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Export ZIP</span>
              </Button>
              <Button
                onClick={onCreateGist}
                disabled={completedVariations.length === 0}
                size="sm"
                variant="outline"
                className="bg-white/5 border-white/10 hover:bg-white/10 magnetic-hover"
              >
                <GitBranch className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Create Gist</span>
              </Button>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-8 h-8 bg-gradient-to-r from-primary to-orange-600 rounded-full flex items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="h-4 w-4 text-white" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Generated Variations Grid */}
        <div className="flex-1 p-4 sm:p-6">
          <AnimatePresence mode="wait">
            {!hasVariations && !isGenerating ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center h-full text-center"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-6"
                >
                  <Zap className="h-16 w-16 text-primary" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">Ready to Create</h2>
                <p className="text-muted-foreground max-w-md">
                  Enter your component description in the sidebar and watch RAJAI generate 
                  five unique, award-worthy variations for you.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="variations-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-6">
                  <motion.h2 
                    className="text-2xl font-bold mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    Generated Variations
                  </motion.h2>
                  <motion.p 
                    className="text-muted-foreground"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Five unique interpretations of your prompt
                  </motion.p>
                </div>

                {/* Regular variations grid (first 4) */}
                {variations.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                    {variations.slice(0, 4).map((variation, index) => (
                      <PreviewCard
                        key={variation.id}
                        variation={variation}
                        index={index}
                        isSelected={selectedVariation?.id === variation.id}
                        onClick={() => handleVariationSelect(variation)}
                        onViewCode={() => handleVariationSelect(variation)}
                        onRefine={() => console.log('Refine variation', variation.id)}
                        onExpand={() => console.log('Expand variation', variation.id)}
                      />
                    ))}
                  </div>
                )}

                {/* Featured variation (5th one) */}
                {variations.length >= 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <PreviewCard
                      variation={variations[4]}
                      index={4}
                      isSelected={selectedVariation?.id === variations[4].id}
                      onClick={() => handleVariationSelect(variations[4])}
                      onViewCode={() => handleVariationSelect(variations[4])}
                      onRefine={() => console.log('Refine variation', variations[4].id)}
                      onExpand={() => console.log('Expand variation', variations[4].id)}
                    />
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Code Editor Panel - Hidden on mobile, shown in modal */}
        {!isMobile && (
          <CodeEditor
            variation={selectedVariation}
            onRunPlayground={() => console.log('Run in playground')}
            onCompare={() => console.log('Compare variations')}
            onFork={() => console.log('Fork variation')}
          />
        )}
        
        {/* Mobile Code Editor Modal */}
        {isMobile && showCodeEditor && selectedVariation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCodeEditor(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-black border border-white/20 rounded-xl w-full max-w-lg h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-medium">Code Editor</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCodeEditor(false)}
                  className="p-1 hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-hidden">
                <CodeEditor
                  variation={selectedVariation}
                  onRunPlayground={() => console.log('Run in playground')}
                  onCompare={() => console.log('Compare variations')}
                  onFork={() => console.log('Fork variation')}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Floating Action Menu */}
      <motion.div 
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 space-y-2 sm:space-y-3 z-40"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            size={isMobile ? "default" : "lg"}
            className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-gradient-to-r from-primary to-orange-600 shadow-lg hover:shadow-xl magnetic-hover`}
            onClick={onToggleSidebar}
          >
            <Plus className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            size="sm"
            variant="outline"
            className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 magnetic-hover`}
          >
            <History className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            size="sm"
            variant="outline"
            className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 magnetic-hover`}
          >
            <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
