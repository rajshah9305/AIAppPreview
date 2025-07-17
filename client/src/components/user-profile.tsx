import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Key,
  Bell,
  Crown
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface UserProfileProps {
  onOpenSettings?: () => void;
}

export function UserProfile({ onOpenSettings }: UserProfileProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username] = useLocalStorage('rajai_username', 'Anonymous User');
  const [email] = useLocalStorage('rajai_email', '');
  const [apiKey] = useLocalStorage('cerebras_api_key', '');

  const handleOpenSettings = () => {
    setIsDropdownOpen(false);
    if (onOpenSettings) {
      onOpenSettings();
    } else {
      window.dispatchEvent(new CustomEvent('open-settings'));
    }
  };

  return (
    <div className="relative">
      <motion.div
        className="flex items-center space-x-3 cursor-pointer group"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Profile Avatar */}
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-orange-600 rounded-full flex items-center justify-center ring-2 ring-white/10 group-hover:ring-primary/50 transition-all">
            <User className="h-5 w-5 text-white" />
          </div>
          {/* Status indicator */}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black flex items-center justify-center ${
            apiKey ? 'bg-green-500' : 'bg-yellow-500'
          }`}>
            {apiKey ? (
              <div className="w-2 h-2 bg-white rounded-full" />
            ) : (
              <Key className="h-2 w-2 text-white" />
            )}
          </div>
        </div>

        {/* Profile Info - Hidden on mobile */}
        <div className="hidden sm:flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-white">{username}</span>
            <Badge variant="secondary" className="text-xs bg-primary/20 text-primary border-primary/30">
              Pro
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">{email || 'No email set'}</span>
        </div>

        {/* Dropdown Arrow */}
        <motion.div
          animate={{ rotate: isDropdownOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </motion.div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 w-72 glass-panel border border-white/10 rounded-xl p-4 z-50"
          >
            {/* Profile Header */}
            <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-white/10">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-orange-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-white">{username}</h3>
                  <Crown className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">{email || 'No email set'}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${apiKey ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className="text-xs text-muted-foreground">
                    {apiKey ? 'API Connected' : 'API Not Set'}
                  </span>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleOpenSettings}
                className="w-full justify-start hover:bg-white/10"
              >
                <Settings className="h-4 w-4 mr-3" />
                Settings & Profile
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsDropdownOpen(false);
                  window.dispatchEvent(new CustomEvent('open-settings'));
                }}
                className="w-full justify-start hover:bg-white/10"
              >
                <Key className="h-4 w-4 mr-3" />
                API Configuration
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start hover:bg-white/10"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Bell className="h-4 w-4 mr-3" />
                Notifications
              </Button>
              
              <div className="border-t border-white/10 pt-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start hover:bg-red-500/20 text-red-400"
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}