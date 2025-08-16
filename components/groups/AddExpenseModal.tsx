import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Receipt, DollarSign } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  balance: number;
}

interface Expense {
  description: string;
  amount: number;
  paidBy: string;
  paidByName: string;
  splitBetween: string[];
  date: string;
  category: string;
}

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddExpense: (expense: Expense) => void;
  members: Member[];
  currency: string;
  currentUserId: string;
}

const EXPENSE_CATEGORIES = [
  'Food & Drinks',
  'Transportation',
  'Accommodation',
  'Entertainment',
  'Groceries',
  'Utilities',
  'Shopping',
  'Health',
  'Other'
];

export function AddExpenseModal({ 
  open, 
  onOpenChange, 
  onAddExpense, 
  members, 
  currency,
  currentUserId 
}: AddExpenseModalProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(currentUserId);
  const [splitBetween, setSplitBetween] = useState<string[]>([currentUserId]);
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount || !paidBy || splitBetween.length === 0 || !category) return;

    setIsLoading(true);
    
    const paidByMember = members.find(m => m.id === paidBy);
    
    setTimeout(() => {
      onAddExpense({
        description: description.trim(),
        amount: parseFloat(amount),
        paidBy,
        paidByName: paidByMember?.name || '',
        splitBetween,
        date: new Date().toISOString(),
        category
      });
      
      // Reset form
      setDescription('');
      setAmount('');
      setPaidBy(currentUserId);
      setSplitBetween([currentUserId]);
      setCategory('');
      setIsLoading(false);
    }, 1000);
  };

  const handleClose = () => {
    if (!isLoading) {
      setDescription('');
      setAmount('');
      setPaidBy(currentUserId);
      setSplitBetween([currentUserId]);
      setCategory('');
      onOpenChange(false);
    }
  };

  const toggleMemberSplit = (memberId: string) => {
    setSplitBetween(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const splitAmount = splitBetween.length > 0 ? parseFloat(amount || '0') / splitBetween.length : 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] retro-shadow retro-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Receipt className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-left">Add Expense</DialogTitle>
              <DialogDescription className="text-left text-xs uppercase tracking-wider">
                Split a new expense
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 py-4">
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Dinner at restaurant"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="retro-border bg-input-background"
                required
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ({currency})</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10 retro-border bg-input-background"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="retro-border bg-input-background">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Paid By */}
            <div className="space-y-2">
              <Label htmlFor="paid-by">Paid By</Label>
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger className="retro-border bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Split Between */}
            <div className="space-y-3">
              <Label>Split Between</Label>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50">
                    <Checkbox
                      id={`member-${member.id}`}
                      checked={splitBetween.includes(member.id)}
                      onCheckedChange={() => toggleMemberSplit(member.id)}
                    />
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{member.name}</p>
                    </div>
                    {splitBetween.includes(member.id) && (
                      <div className="text-xs text-muted-foreground font-mono">
                        {currency}{splitAmount.toFixed(2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {splitBetween.length > 0 && (
                <div className="text-xs text-muted-foreground p-2 bg-muted/30 rounded-md">
                  Split {splitBetween.length > 1 ? 'equally' : ''} between {splitBetween.length} member{splitBetween.length !== 1 ? 's' : ''}
                  {amount && ` • ${currency}${splitAmount.toFixed(2)} each`}
                </div>
              )}
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
              disabled={!description.trim() || !amount || !paidBy || splitBetween.length === 0 || !category || isLoading}
              className="retro-shadow"
            >
              {isLoading ? 'ADDING...' : 'ADD EXPENSE'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}