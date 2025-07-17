import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ExpandIcon, 
  Code, 
  Sparkles, 
  Star,
  Download,
  ExternalLink
} from 'lucide-react';
import type { CodeVariation } from '@/types';

interface PreviewCardProps {
  variation: CodeVariation;
  index: number;
  isSelected?: boolean;
  onClick?: () => void;
  onViewCode?: () => void;
  onRefine?: () => void;
  onExpand?: () => void;
}

const styleColors = {
  'Brutalist': 'bg-red-500',
  'Minimalist': 'bg-blue-500', 
  'Gradient': 'bg-purple-500',
  'Neumorphism': 'bg-green-500',
  'Experimental': 'bg-gradient-to-r from-primary to-orange-600'
};

const qualityColor = (quality: number) => {
  if (quality >= 9) return 'text-green-400';
  if (quality >= 8) return 'text-yellow-400';
  return 'text-orange-400';
};

export function PreviewCard({
  variation,
  index,
  isSelected,
  onClick,
  onViewCode,
  onRefine,
  onExpand
}: PreviewCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    initial: { 
      opacity: 0, 
      y: 30,
      rotateX: 15 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      rotateX: 5,
      rotateY: 5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const getStatusBadge = () => {
    switch (variation.status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-400 border-yellow-400">Pending</Badge>;
      case 'generating':
        return <Badge variant="outline" className="text-blue-400 border-blue-400">Generating...</Badge>;
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500">Complete</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge className="bg-green-500/20 text-green-400 border-green-500">Ready</Badge>;
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={`preview-card glass-panel rounded-xl p-4 group cursor-pointer transition-all duration-500 ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center space-x-2">
          <motion.div 
            className={`w-3 h-3 rounded-full ${styleColors[variation.style as keyof typeof styleColors] || 'bg-primary'}`}
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.5 }}
          />
          <span className="text-sm font-medium">Variation {index + 1}</span>
          <span className="text-xs text-muted-foreground">{variation.style}</span>
          {variation.quality >= 9.5 && (
            <Badge className="bg-primary/20 text-primary text-xs">
              AI Recommended
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button
            size="sm"
            variant="ghost"
            className="p-0.5 sm:p-1 hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              onExpand?.();
            }}
          >
            <ExpandIcon className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="p-0.5 sm:p-1 hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              onViewCode?.();
            }}
          >
            <Code className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="p-0.5 sm:p-1 hover:bg-white/10 text-primary"
            onClick={(e) => {
              e.stopPropagation();
              onRefine?.();
            }}
          >
            <Sparkles className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {/* Preview iframe placeholder */}
      <motion.div 
        className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-white/10 relative overflow-hidden group-hover:border-primary/50 transition-colors"
        whileHover={{ scale: 1.02 }}
      >
        {variation.code ? (
          <iframe
            srcDoc={variation.code}
            className="w-full h-full rounded-lg"
            sandbox="allow-scripts allow-same-origin"
            title={`Variation ${index + 1} Preview`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {variation.status === 'generating' ? (
              <motion.div
                className="text-primary"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-8 w-8" />
              </motion.div>
            ) : (
              <div className="text-muted-foreground">
                <Code className="h-8 w-8" />
              </div>
            )}
          </div>
        )}
        
        <div className="absolute bottom-3 left-3 flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs bg-black/50">
            Live Preview
          </Badge>
          {getStatusBadge()}
        </div>
        
        {variation.status === 'generating' && variation.progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <motion.div 
              className="h-full bg-primary progress-glow"
              initial={{ width: 0 }}
              animate={{ width: `${variation.progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}
      </motion.div>
      
      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          <span>{variation.size}</span> • <span>{variation.lines} lines</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={`w-1 h-1 rounded-full ${
                  i < Math.floor(variation.quality / 3) ? 'bg-green-500' : 'bg-yellow-500'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
              />
            ))}
            <span className={`text-xs ml-1 ${qualityColor(variation.quality)}`}>
              Quality: {variation.quality}
            </span>
          </div>
          {variation.quality >= 9.5 && (
            <Badge className="bg-primary text-white text-xs font-medium">
              Best Match
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}
