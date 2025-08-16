import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Users, BookOpen, UserPlus, X } from 'lucide-react';
import { PhoneBook } from '../ui/PhoneBook';
import { Badge } from '../ui/badge';

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
}

interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateGroup: (name: string, description: string, currency: string, members: Contact[]) => void;
}

const CURRENCIES = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' }
];

export function CreateGroupModal({ open, onOpenChange, onCreateGroup }: CreateGroupModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('₹');
  const [members, setMembers] = useState<Contact[]>([]);
  const [showPhoneBook, setShowPhoneBook] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !currency) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onCreateGroup(name.trim(), description.trim(), currency, members);
      setName('');
      setDescription('');
      setCurrency('₹');
      setMembers([]);
      setIsLoading(false);
    }, 1000);
  };

  const handleClose = () => {
    if (!isLoading) {
      setName('');
      setDescription('');
      setCurrency('₹');
      setMembers([]);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] retro-shadow retro-border">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-left">Create New Group</DialogTitle>
              <DialogDescription className="text-left text-xs uppercase tracking-wider">
                Start splitting expenses
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="group-name">Group Name</Label>
              <Input
                id="group-name"
                placeholder="e.g., Roommates, Weekend Trip"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="retro-border bg-input-background input-mobile-enhanced"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="group-description">Description</Label>
              <Textarea
                id="group-description"
                placeholder="What's this group for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="retro-border bg-input-background resize-none input-mobile-enhanced"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="group-currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="retro-border bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((curr) => (
                    <SelectItem key={curr.code} value={curr.symbol}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{curr.symbol}</span>
                        <span>{curr.name} ({curr.code})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                All expenses will be displayed in this currency
              </p>
            </div>

            <div className="space-y-2">
              <Label>Add Members</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPhoneBook(true)}
                  className="flex items-center gap-2 justify-center mobile-optimized"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Open Phone Book</span>
                </Button>
              </div>
              
              {members.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm">Selected Members ({members.length})</Label>
                  <div className="space-y-2">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-sm">{member.name}</div>
                            <div className="text-xs text-muted-foreground">{member.phoneNumber}</div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setMembers(members.filter(m => m.id !== member.id))}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive mobile-optimized"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">
                Select contacts from your phone book to add to the group.
              </p>
            </div>
          </div>
          
          <DialogFooter className="modal-mobile-enhanced dialog-footer">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose} 
              disabled={isLoading}
              className="retro-border btn-mobile-full"
            >
              CANCEL
            </Button>
            <Button 
              type="submit" 
              disabled={!name.trim() || !currency || isLoading}
              className="retro-shadow btn-mobile-full"
            >
              {isLoading ? 'CREATING...' : 'CREATE GROUP'}
            </Button>
          </DialogFooter>
        </form>
        
        {/* PhoneBook Modal */}
        <PhoneBook
          open={showPhoneBook}
          onOpenChange={setShowPhoneBook}
          onSelectContacts={(selectedContacts) => {
            setMembers(selectedContacts);
            setShowPhoneBook(false);
          }}
          selectedContacts={members}
        />
      </DialogContent>
    </Dialog>
  );
}