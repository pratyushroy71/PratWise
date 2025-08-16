import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Hash } from 'lucide-react';

interface JoinGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoinGroup: (inviteCode: string) => void;
}

export function JoinGroupModal({ open, onOpenChange, onJoinGroup }: JoinGroupModalProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onJoinGroup(inviteCode.trim().toUpperCase());
      setInviteCode('');
      setIsLoading(false);
    }, 1000);
  };

  const handleClose = () => {
    if (!isLoading) {
      setInviteCode('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] retro-shadow retro-border">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Hash className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-left">Join Group</DialogTitle>
              <DialogDescription className="text-left text-xs uppercase tracking-wider">
                Enter invite code
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-code">Invite Code</Label>
              <Input
                id="invite-code"
                placeholder="TRIP2024"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="uppercase tracking-wider font-mono retro-border bg-input-background"
                maxLength={10}
                required
              />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Ask a group member for the code
              </p>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose} 
              disabled={isLoading}
              className="retro-border"
            >
              CANCEL
            </Button>
            <Button 
              type="submit" 
              disabled={!inviteCode.trim() || isLoading}
              className="retro-shadow"
            >
              {isLoading ? 'JOINING...' : 'JOIN GROUP'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}