
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AIAnalysisService } from '@/services/aiAnalysisService';
import { KeyRound } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeySet?: () => void;
}

const ApiKeyInput = ({ onApiKeySet }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  useEffect(() => {
    // Check if API key is already set
    setHasApiKey(AIAnalysisService.hasApiKey());
  }, []);

  const handleSubmit = () => {
    if (apiKey.trim()) {
      AIAnalysisService.setApiKey(apiKey.trim());
      setHasApiKey(true);
      setIsDialogOpen(false);
      
      if (onApiKeySet) {
        onApiKeySet();
      }
    }
  };

  return (
    <>
      <Button 
        variant={hasApiKey ? "outline" : "secondary"}
        size="sm" 
        onClick={() => setIsDialogOpen(true)}
        className={hasApiKey ? "border-green-500 text-green-500" : ""}
      >
        <KeyRound className="h-4 w-4 mr-2" />
        {hasApiKey ? "API Key Set" : "Set OpenAI API Key"}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set OpenAI API Key</DialogTitle>
            <DialogDescription>
              Enter your OpenAI API key to enable enhanced data analysis with AI. 
              Your key is stored in memory only and is never saved to disk.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">
              You can get your API key from the <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="text-primary hover:underline">OpenAI dashboard</a>.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!apiKey.trim()}>Save API Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApiKeyInput;
