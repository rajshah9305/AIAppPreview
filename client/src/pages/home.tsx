import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sidebar } from '@/components/sidebar';
import { MainContent } from '@/components/main-content';
import { ParticleBackground } from '@/components/particle-background';
import { SettingsPanel } from '@/components/settings-panel';
import { useWebSocket } from '@/hooks/use-websocket';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { generateWithCerebras } from '@/lib/cerebras';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { CodeVariation, GenerationProgress, WebSocketMessage } from '@/types';

export default function Home() {
  const [variations, setVariations] = useState<CodeVariation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGenerationId, setCurrentGenerationId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [user] = useLocalStorage('rajai_user', null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // WebSocket for real-time updates
  const { isConnected, sendMessage } = useWebSocket({
    onMessage: handleWebSocketMessage,
    onConnect: () => {
      console.log('Connected to RAJAI WebSocket');
    },
    onDisconnect: () => {
      console.log('Disconnected from RAJAI WebSocket');
    }
  });

  function handleWebSocketMessage(message: WebSocketMessage) {
    if (message.type === 'generation_update' && message.update) {
      updateVariationProgress(message.update);
    }
  }

  const updateVariationProgress = useCallback((update: GenerationProgress) => {
    setVariations(prev => {
      const index = prev.findIndex(v => v.id === update.variationId);
      if (index === -1) return prev;
      
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        status: update.status,
        progress: update.progress,
        code: update.code || updated[index].code
      };
      
      return updated;
    });
  }, []);

  // Settings panel event listener
  useEffect(() => {
    const handleOpenSettings = () => setSettingsOpen(true);
    window.addEventListener('open-settings', handleOpenSettings);
    return () => window.removeEventListener('open-settings', handleOpenSettings);
  }, []);

  // Generation mutation
  const generateMutation = useMutation({
    mutationFn: async ({ prompt, apiKey }: { prompt: string; apiKey: string }) => {
      const response = await apiRequest('POST', '/api/generate', { prompt, userId: user?.id });
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentGenerationId(data.generationId);
      // Subscribe to WebSocket updates for this generation
      sendMessage({
        type: 'subscribe_generation',
        generationId: data.generationId
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  });

  const handleGenerate = useCallback(async (prompt: string, apiKey: string) => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Cerebras API key",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setVariations([]);

    // Initialize 5 variations
    const initialVariations: CodeVariation[] = [
      { id: 'var_1', code: '', style: 'Brutalist', quality: 8.7, size: '2.1KB', lines: 23, status: 'pending', progress: 0 },
      { id: 'var_2', code: '', style: 'Minimalist', quality: 9.2, size: '1.8KB', lines: 18, status: 'pending', progress: 0 },
      { id: 'var_3', code: '', style: 'Gradient', quality: 8.9, size: '3.2KB', lines: 31, status: 'pending', progress: 0 },
      { id: 'var_4', code: '', style: 'Neumorphism', quality: 9.4, size: '2.8KB', lines: 25, status: 'pending', progress: 0 },
      { id: 'var_5', code: '', style: 'Experimental', quality: 9.8, size: '4.7KB', lines: 42, status: 'pending', progress: 0 }
    ];

    setVariations(initialVariations);

    try {
      // Start the generation process
      await generateMutation.mutateAsync({ prompt, apiKey });

      // Simulate individual variations being generated
      initialVariations.forEach((variation, index) => {
        setTimeout(async () => {
          try {
            // Update status to generating
            setVariations(prev => {
              const updated = [...prev];
              updated[index] = { ...updated[index], status: 'generating' };
              return updated;
            });

            // Generate the actual code
            const code = await generateWithCerebras({
              prompt: `${prompt} - Create a ${variation.style.toLowerCase()} style variation`,
              apiKey,
              onProgress: (progress) => {
                setVariations(prev => {
                  const updated = [...prev];
                  updated[index] = { ...updated[index], progress };
                  return updated;
                });
              }
            });

            // Update with completed code
            setVariations(prev => {
              const updated = [...prev];
              updated[index] = {
                ...updated[index],
                code,
                status: 'completed',
                progress: 100
              };
              return updated;
            });

          } catch (error) {
            setVariations(prev => {
              const updated = [...prev];
              updated[index] = {
                ...updated[index],
                status: 'error'
              };
              return updated;
            });
          }
        }, index * 500);
      });

      // Set generating to false after all variations are processed
      setTimeout(() => {
        setIsGenerating(false);
      }, 5000);

    } catch (error) {
      setIsGenerating(false);
      console.error('Generation failed:', error);
    }
  }, [generateMutation, sendMessage, toast]);

  const handleRefineChat = useCallback((message: string) => {
    toast({
      title: "Chat Feature",
      description: "Refinement chat will be implemented in the next iteration",
    });
  }, [toast]);

  const handleExportZip = useCallback(() => {
    toast({
      title: "Export ZIP",
      description: "ZIP export functionality will be implemented soon",
    });
  }, [toast]);

  const handleCreateGist = useCallback(() => {
    toast({
      title: "Create Gist",
      description: "GitHub Gist creation will be implemented soon",
    });
  }, [toast]);

  return (
    <motion.div 
      className="min-h-screen bg-black text-rajai-light font-inter overflow-x-hidden relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ParticleBackground />
      
      {/* Main Layout */}
      <div className="flex h-screen relative z-10">
        <Sidebar
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          onRefineChat={handleRefineChat}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <MainContent
          variations={variations}
          isGenerating={isGenerating}
          onExportZip={handleExportZip}
          onCreateGist={handleCreateGist}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
      />

      {/* WebSocket connection indicator */}
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-4 bg-yellow-500/20 border border-yellow-500 text-yellow-400 px-3 py-2 rounded-lg text-sm"
        >
          Reconnecting to server...
        </motion.div>
      )}
    </motion.div>
  );
}
