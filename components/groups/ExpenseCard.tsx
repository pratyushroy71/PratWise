import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Receipt, Calendar } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
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

interface ExpenseCardProps {
  expense: Expense;
  currency: string;
  members: Member[];
}

export function ExpenseCard({ expense, currency, members }: ExpenseCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const splitMembers = members.filter(member => expense.splitBetween.includes(member.id));
  const amountPerPerson = expense.amount / expense.splitBetween.length;

  return (
    <Card className="retro-shadow retro-border hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
              <Receipt className="h-4 w-4 text-primary" />
            </div>
            
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium truncate">{expense.description}</h4>
                <div className="text-right shrink-0">
                  <p className="font-mono">{currency}{expense.amount.toFixed(2)}</p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {expense.category}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span className="text-xs uppercase tracking-wider">
                    {formatDate(expense.date)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground uppercase tracking-wider text-xs">
                    Paid by:
                  </span>
                  <span className="font-medium">{expense.paidByName}</span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    Split between {expense.splitBetween.length} member{expense.splitBetween.length !== 1 ? 's' : ''} 
                    <span className="font-mono ml-1">({currency}{amountPerPerson.toFixed(2)} each)</span>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    {splitMembers.map((member) => (
                      <div key={member.id} className="flex items-center gap-1">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{member.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}