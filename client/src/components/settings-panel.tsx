import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  User, 
  Key, 
  Bell,
  Palette,
  Monitor,
  Download,
  Trash2,
  Save,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [apiKey, setApiKey] = useLocalStorage('cerebras_api_key', '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [username, setUsername] = useLocalStorage('rajai_username', 'Anonymous User');
  const [email, setEmail] = useLocalStorage('rajai_email', '');
  const [notifications, setNotifications] = useLocalStorage('rajai_notifications', true);
  const [autoSave, setAutoSave] = useLocalStorage('rajai_autosave', true);
  const [theme, setTheme] = useLocalStorage('rajai_theme', 'dark');
  const { toast } = useToast();

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile settings have been saved successfully."
    });
  };

  const handleClearData = () => {
    localStorage.removeItem('rajai_projects');
    localStorage.removeItem('rajai_history');
    toast({
      title: "Data Cleared",
      description: "All local data has been cleared successfully."
    });
  };

  const handleExportData = () => {
    const data = {
      username,
      email,
      projects: JSON.parse(localStorage.getItem('rajai_projects') || '[]'),
      settings: {
        notifications,
        autoSave,
        theme
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rajai-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "Your data has been exported successfully."
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-panel w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-orange-600 rounded-lg flex items-center justify-center">
                <Settings className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold">Settings</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-white/10">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/5 border-white/10">
                <TabsTrigger value="profile" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="api" className="flex items-center space-x-2">
                  <Key className="h-4 w-4" />
                  <span>API Keys</span>
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center space-x-2">
                  <Monitor className="h-4 w-4" />
                  <span>Preferences</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-orange-600 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{username}</h3>
                      <p className="text-sm text-muted-foreground">{email || 'No email set'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-black/50 border-white/20 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-black/50 border-white/20 focus:border-primary"
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveProfile} className="w-full bg-gradient-to-r from-primary to-orange-600">
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="api" className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Cerebras AI API Key</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Enter your Cerebras API key to enable AI code generation. Your key is stored securely in your browser.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <div className="relative">
                      <Input
                        id="apiKey"
                        type={showApiKey ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="csk-..."
                        className="bg-black/50 border-white/20 focus:border-primary pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-white/10"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${apiKey ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm">
                      {apiKey ? 'API Key configured' : 'No API key set'}
                    </span>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h4 className="font-medium text-blue-400 mb-2">How to get your API key:</h4>
                    <ol className="text-sm text-blue-300 space-y-1 list-decimal list-inside">
                      <li>Visit the Cerebras AI platform</li>
                      <li>Create an account or sign in</li>
                      <li>Navigate to API settings</li>
                      <li>Generate a new API key</li>
                      <li>Copy and paste it here</li>
                    </ol>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preferences" className="p-6 space-y-6">
                <div className="space-y-6">
                  {/* Notifications */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notifications</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Generation Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when code generation is complete
                        </p>
                      </div>
                      <Switch
                        checked={notifications}
                        onCheckedChange={setNotifications}
                      />
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Auto-save */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Auto-save</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Auto-save Projects</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically save your projects locally
                        </p>
                      </div>
                      <Switch
                        checked={autoSave}
                        onCheckedChange={setAutoSave}
                      />
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Data Management */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Data Management</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        onClick={handleExportData}
                        className="bg-white/5 border-white/10 hover:bg-white/10"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleClearData}
                        className="bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All Data
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}