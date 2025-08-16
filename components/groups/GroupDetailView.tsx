import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { ArrowLeft, Plus, Users, DollarSign, Settings, Receipt, UserPlus, Copy } from 'lucide-react';
import { AddExpenseModal } from './AddExpenseModal';
import { AddMemberModal } from './AddMemberModal';
import { GroupSettingsModal } from './GroupSettingsModal';
import { ExpenseCard } from './ExpenseCard';
import { toast } from 'sonner@2.0.3';

interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  balance: number;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  paidByName: string;
  splitBetween: string[];
  date: string;
  category: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: Member[];
  expenses: Expense[];
  currency: string;
  inviteCode: string;
  createdBy: string;
  createdAt: string;
}

interface GroupDetailViewProps {
  group: Group;
  currentUserId: string;
  onBack: () => void;
  onUpdateGroup: (group: Group) => void;
}

export function GroupDetailView({ group, currentUserId, onBack, onUpdateGroup }: GroupDetailViewProps) {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString()
    };
    
    const updatedGroup: Group = {
      ...group,
      expenses: [newExpense, ...group.expenses]
    };
    
    onUpdateGroup(updatedGroup);
    setShowAddExpense(false);
    toast.success('Expense added successfully!');
  };

  const handleAddMember = (email: string) => {
    // In real app, this would send an invitation
    const newMember: Member = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email: email,
      balance: 0
    };
    
    const updatedGroup: Group = {
      ...group,
      members: [...group.members, newMember]
    };
    
    onUpdateGroup(updatedGroup);
    setShowAddMember(false);
    toast.success('Member added successfully!');
  };

  const handleUpdateSettings = (name: string, description: string, currency: string) => {
    const updatedGroup: Group = {
      ...group,
      name,
      description,
      currency
    };
    
    onUpdateGroup(updatedGroup);
    setShowSettings(false);
    toast.success('Group settings updated!');
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(group.inviteCode);
    toast.success('Invite code copied!', {
      description: `Share code ${group.inviteCode} with friends`
    });
  };

  const currentUserBalance = group.members.find(m => m.id === currentUserId)?.balance || 0;
  const totalExpenses = group.expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card retro-shadow sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="retro-shadow"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                BACK
              </Button>
              <div>
                <h1 className="text-xl">{group.name}</h1>
                <p className="text-sm text-muted-foreground">{group.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {group.currency}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowSettings(true)}
                className="retro-shadow"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="retro-shadow retro-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">
                    Your Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-xl font-mono ${currentUserBalance >= 0 ? 'retro-green' : 'retro-red'}`}>
                    {group.currency}{Math.abs(currentUserBalance).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {currentUserBalance >= 0 ? 'YOU ARE OWED' : 'YOU OWE'}
                  </p>
                </CardContent>
              </Card>

              <Card className="retro-shadow retro-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">
                    Total Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-mono">
                    {group.currency}{totalExpenses.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {group.expenses.length} EXPENSES
                  </p>
                </CardContent>
              </Card>

              <Card className="retro-shadow retro-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">
                    Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-mono">
                    {group.members.length}
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    ACTIVE MEMBERS
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => setShowAddExpense(true)}
                className="flex items-center gap-2 retro-shadow"
              >
                <Plus className="h-4 w-4" />
                ADD EXPENSE
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddMember(true)}
                className="flex items-center gap-2 retro-shadow retro-border"
              >
                <UserPlus className="h-4 w-4" />
                ADD MEMBER
              </Button>
            </div>

            {/* Expenses List */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg">Recent Expenses</h3>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </div>
              
              {group.expenses.length === 0 ? (
                <Card className="retro-shadow retro-border">
                  <CardContent className="flex items-center justify-center py-8">
                    <div className="text-center space-y-3">
                      <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <Receipt className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="text-sm">No expenses yet</h4>
                        <p className="text-xs text-muted-foreground">
                          Add your first expense to get started
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {group.expenses.map((expense) => (
                    <ExpenseCard 
                      key={expense.id} 
                      expense={expense} 
                      currency={group.currency}
                      members={group.members}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Invite Code */}
            <Card className="retro-shadow retro-border">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider">
                  Invite Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-primary/5 border retro-border rounded-md">
                  <code className="flex-1 text-sm font-mono text-primary">
                    {group.inviteCode}
                  </code>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={copyInviteCode}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Share this code with friends to invite them
                </p>
              </CardContent>
            </Card>

            {/* Members */}
            <Card className="retro-shadow retro-border">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Members ({group.members.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {group.members.map((member, index) => (
                  <div key={member.id}>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 retro-border">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{member.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-mono ${member.balance >= 0 ? 'retro-green' : 'retro-red'}`}>
                          {member.balance >= 0 ? '+' : ''}{group.currency}{member.balance.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    {index < group.members.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddExpenseModal
        open={showAddExpense}
        onOpenChange={setShowAddExpense}
        onAddExpense={handleAddExpense}
        members={group.members}
        currency={group.currency}
        currentUserId={currentUserId}
      />

      <AddMemberModal
        open={showAddMember}
        onOpenChange={setShowAddMember}
        onAddMember={handleAddMember}
      />

      <GroupSettingsModal
        open={showSettings}
        onOpenChange={setShowSettings}
        onUpdateSettings={handleUpdateSettings}
        group={group}
      />
    </div>
  );
}