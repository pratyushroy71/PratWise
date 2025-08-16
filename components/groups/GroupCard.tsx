import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Users, DollarSign, Copy, Hash, ArrowRight } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  totalExpenses: number;
  userBalance: number;
  inviteCode: string;
}

interface GroupCardProps {
  group: Group;
  onViewDetails: () => void;
}

export function GroupCard({ group, onViewDetails }: GroupCardProps) {
  const copyInviteCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(group.inviteCode);
    toast.success('Invite code copied!');
  };

  return (
    <Card className="modern-shadow hover:modern-shadow-lg smooth-transition cursor-pointer group" onClick={onViewDetails}>
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate group-hover:text-primary smooth-transition">
              {group.name}
            </h3>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {group.description}
            </p>
          </div>
          <Badge 
            variant={group.userBalance >= 0 ? 'default' : 'destructive'} 
            className="text-xs font-mono shrink-0"
          >
            {group.userBalance >= 0 ? '+' : '-'}${Math.abs(group.userBalance).toFixed(2)}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{group.memberCount} members</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-3 w-3" />
            <span>${group.totalExpenses.toFixed(2)}</span>
          </div>
        </div>

        {/* Balance Status */}
        <div className="p-3 rounded-lg bg-muted/30 border">
          <div className="text-xs text-muted-foreground mb-1">Balance</div>
          {group.userBalance > 0 ? (
            <p className="text-sm font-medium balance-positive">
              You are owed ${group.userBalance.toFixed(2)}
            </p>
          ) : group.userBalance < 0 ? (
            <p className="text-sm font-medium balance-negative">
              You owe ${Math.abs(group.userBalance).toFixed(2)}
            </p>
          ) : (
            <p className="text-sm font-medium text-muted-foreground">
              All settled up
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Hash className="h-3 w-3" />
            <code className="text-primary">{group.inviteCode}</code>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={copyInviteCode}
              className="h-5 w-5 p-0 hover:bg-primary/10"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-xs group-hover:bg-primary group-hover:text-primary-foreground smooth-transition"
          >
            View
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}