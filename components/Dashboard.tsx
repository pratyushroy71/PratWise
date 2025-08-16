import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Users, DollarSign, TrendingUp, TrendingDown, LogOut, Wallet, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { CreateGroupModal } from './groups/CreateGroupModal';
import { JoinGroupModal } from './groups/JoinGroupModal';
import { GroupCard } from './groups/GroupCard';
import { GroupDetailView } from './groups/GroupDetailView';

interface User {
  id: string;
  name: string;
  email: string;
}

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

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const GROUPS_PER_PAGE = 6;

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showJoinGroup, setShowJoinGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Generate more sample groups for pagination demo
  const [groups, setGroups] = useState<Group[]>([
    {
      id: '1',
      name: 'Roommates',
      description: 'Shared apartment expenses',
      members: [
        { id: user.id, name: user.name, email: user.email, balance: -123.75 },
        { id: '2', name: 'Alice Johnson', email: 'alice@example.com', balance: 45.25 },
        { id: '3', name: 'Bob Wilson', email: 'bob@example.com', balance: 78.50 },
        { id: '4', name: 'Carol Davis', email: 'carol@example.com', balance: 0.00 }
      ],
      expenses: [
        {
          id: '1',
          description: 'Grocery shopping',
          amount: 156.80,
          paidBy: '2',
          paidByName: 'Alice Johnson',
          splitBetween: [user.id, '2', '3', '4'],
          date: new Date().toISOString(),
          category: 'Groceries'
        }
      ],
      currency: '$',
      inviteCode: 'ROOM2024',
      createdBy: user.id,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Weekend Trip',
      description: 'Mountain cabin getaway',
      members: [
        { id: user.id, name: user.name, email: user.email, balance: 85.25 },
        { id: '5', name: 'David Lee', email: 'david@example.com', balance: -25.75 }
      ],
      expenses: [],
      currency: '$',
      inviteCode: 'TRIP2024',
      createdBy: user.id,
      createdAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '3',
      name: 'Office Lunch',
      description: 'Team lunch expenses',
      members: [{ id: user.id, name: user.name, email: user.email, balance: -15.50 }],
      expenses: [],
      currency: '$',
      inviteCode: 'LUNCH24',
      createdBy: user.id,
      createdAt: '2024-02-01T00:00:00Z'
    },
    {
      id: '4',
      name: 'Family Vacation',
      description: 'Summer trip to Italy',
      members: [{ id: user.id, name: user.name, email: user.email, balance: 245.80 }],
      expenses: [],
      currency: '€',
      inviteCode: 'ITALY24',
      createdBy: user.id,
      createdAt: '2024-02-15T00:00:00Z'
    },
    {
      id: '5',
      name: 'Book Club',
      description: 'Monthly book purchases',
      members: [{ id: user.id, name: user.name, email: user.email, balance: 12.30 }],
      expenses: [],
      currency: '$',
      inviteCode: 'BOOKS24',
      createdBy: user.id,
      createdAt: '2024-03-01T00:00:00Z'
    },
    {
      id: '6',
      name: 'Gym Membership',
      description: 'Shared fitness expenses',
      members: [{ id: user.id, name: user.name, email: user.email, balance: -89.99 }],
      expenses: [],
      currency: '$',
      inviteCode: 'GYM2024',
      createdBy: user.id,
      createdAt: '2024-03-10T00:00:00Z'
    },
    {
      id: '7',
      name: 'Concert Night',
      description: 'Music festival tickets',
      members: [{ id: user.id, name: user.name, email: user.email, balance: 67.50 }],
      expenses: [],
      currency: '$',
      inviteCode: 'MUSIC24',
      createdBy: user.id,
      createdAt: '2024-03-20T00:00:00Z'
    }
  ]);

  const handleCreateGroup = (name: string, description: string, currency: string, members: any[] = []) => {
    const newGroup: Group = {
      id: Date.now().toString(),
      name,
      description,
      members: [
        { id: user.id, name: user.name, email: user.email, balance: 0 },
        ...members.map(member => ({
          id: member.id,
          name: member.name,
          email: member.email || `${member.phoneNumber}@phone.com`,
          balance: 0
        }))
      ],
      expenses: [],
      currency,
      inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      createdBy: user.id,
      createdAt: new Date().toISOString()
    };
    setGroups([newGroup, ...groups]);
    setShowCreateGroup(false);
  };

  const handleJoinGroup = (inviteCode: string) => {
    console.log('Joining group with code:', inviteCode);
    setShowJoinGroup(false);
  };

  const handleUpdateGroup = (updatedGroup: Group) => {
    setGroups(groups.map(g => g.id === updatedGroup.id ? updatedGroup : g));
    setSelectedGroup(updatedGroup);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Filter, sort, and paginate groups
  const filteredAndSortedGroups = useMemo(() => {
    // First filter by search query
    let filteredGroups = groups;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredGroups = groups.filter(group => 
        group.name.toLowerCase().includes(query) ||
        group.description.toLowerCase().includes(query)
      );
    }

    // Then sort
    const sorted = [...filteredGroups].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [groups, sortBy, searchQuery]);

  const totalPages = Math.ceil(filteredAndSortedGroups.length / GROUPS_PER_PAGE);
  const paginatedGroups = filteredAndSortedGroups.slice(
    (currentPage - 1) * GROUPS_PER_PAGE,
    currentPage * GROUPS_PER_PAGE
  );

  // Reset to page 1 when search or sorting changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, searchQuery]);

  // Show group detail view if a group is selected
  if (selectedGroup) {
    return (
      <GroupDetailView
        group={selectedGroup}
        currentUserId={user.id}
        onBack={() => setSelectedGroup(null)}
        onUpdateGroup={handleUpdateGroup}
      />
    );
  }

  // Calculate totals
  const userBalances = groups.map(group => {
    const userMember = group.members.find(m => m.id === user.id);
    return userMember?.balance || 0;
  });

  const totalBalance = userBalances.reduce((sum, balance) => sum + balance, 0);
  const totalOwed = userBalances.filter(b => b < 0).reduce((sum, balance) => sum + Math.abs(balance), 0);
  const totalOwing = userBalances.filter(b => b > 0).reduce((sum, balance) => sum + balance, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Mobile Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 md:px-4 py-2 md:py-3 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex items-center gap-1 md:gap-2">
                <Wallet className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                <h1 className="text-base md:text-lg font-semibold compact-spacing">PratWise</h1>
              </div>
              <Badge variant="secondary" className="text-xs px-1 md:px-2 py-0.5 md:py-1 hidden sm:block">
                {groups.length} groups
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 md:gap-3">
              <Avatar className="h-6 w-6 md:h-7 md:w-7">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-sm">
                <p className="font-medium leading-none">{user.name}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout} className="h-7 w-7 md:h-8 md:w-8 p-0 mobile-optimized">
                <LogOut className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6 max-w-7xl space-y-4 md:space-y-6">
        {/* Enhanced Mobile Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <Card className="modern-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Net Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className={`text-2xl font-semibold ${totalBalance >= 0 ? 'balance-positive' : 'balance-negative'}`}>
                ${Math.abs(totalBalance).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalBalance >= 0 ? 'You are owed' : 'You owe'}
              </p>
            </CardContent>
          </Card>
          
          <Card className="modern-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">You Owe</CardTitle>
                <TrendingDown className="h-4 w-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-semibold balance-negative">${totalOwed.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {userBalances.filter(b => b < 0).length} groups
              </p>
            </CardContent>
          </Card>
          
          <Card className="modern-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">You're Owed</CardTitle>
                <TrendingUp className="h-4 w-4 text-accent-green" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-semibold balance-positive">${totalOwing.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {userBalances.filter(b => b > 0).length} groups
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Mobile Actions and Controls */}
        <div className="flex flex-col gap-4">
          {/* Action Buttons */}
          <div className="flex gap-2 md:gap-3">
            <Button onClick={() => setShowCreateGroup(true)} size="sm" className="smooth-transition flex-1 md:flex-none mobile-optimized">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">New Group</span>
              <span className="sm:hidden">New</span>
            </Button>
            <Button variant="outline" onClick={() => setShowJoinGroup(true)} size="sm" className="smooth-transition flex-1 md:flex-none mobile-optimized">
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Join Group</span>
              <span className="sm:hidden">Join</span>
            </Button>
          </div>
          
          {/* Search and Sort Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-10 md:h-8 text-sm mobile-optimized"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSearch}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 md:h-6 md:w-6 p-0 hover:bg-muted mobile-optimized"
                >
                  <X className="h-4 w-4 md:h-3 md:w-3" />
                </Button>
              )}
            </div>
            
            {/* Sort Select */}
            <Select value={sortBy} onValueChange={(value: 'newest' | 'oldest' | 'name') => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-32 h-10 md:h-8 text-xs mobile-optimized">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Search className="h-4 w-4" />
            <span>
              {filteredAndSortedGroups.length === 0 
                ? `No groups found for "${searchQuery}"`
                : `Found ${filteredAndSortedGroups.length} group${filteredAndSortedGroups.length !== 1 ? 's' : ''} for "${searchQuery}"`
              }
            </span>
            {filteredAndSortedGroups.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="h-6 px-2 text-xs hover:bg-muted"
              >
                Clear
              </Button>
            )}
          </div>
        )}

        {/* Groups Grid */}
        {groups.length === 0 ? (
          <Card className="modern-shadow">
            <CardContent className="flex items-center justify-center py-16">
              <div className="text-center space-y-4 max-w-md">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">No groups yet</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create your first group to start splitting expenses
                  </p>
                </div>
                <Button onClick={() => setShowCreateGroup(true)} className="smooth-transition">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Group
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : filteredAndSortedGroups.length === 0 ? (
          <Card className="modern-shadow">
            <CardContent className="flex items-center justify-center py-16">
              <div className="text-center space-y-4 max-w-md">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">No groups found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try adjusting your search terms or create a new group
                  </p>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={handleClearSearch} className="smooth-transition">
                    Clear Search
                  </Button>
                  <Button onClick={() => setShowCreateGroup(true)} className="smooth-transition">
                    <Plus className="h-4 w-4 mr-2" />
                    New Group
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {paginatedGroups.map((group) => {
                const userMember = group.members.find(m => m.id === user.id);
                const userBalance = userMember?.balance || 0;
                const totalExpenses = group.expenses.reduce((sum, exp) => sum + exp.amount, 0);
                
                return (
                  <GroupCard 
                    key={group.id} 
                    group={{
                      id: group.id,
                      name: group.name,
                      description: group.description,
                      memberCount: group.members.length,
                      totalExpenses,
                      userBalance,
                      inviteCode: group.inviteCode
                    }}
                    onViewDetails={() => setSelectedGroup(group)}
                  />
                );
              })}
            </div>

            {/* Enhanced Mobile Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 md:gap-2 mt-4 md:mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 md:h-8 md:w-8 p-0 mobile-optimized"
                >
                  <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="h-8 w-8 p-0 text-xs mobile-optimized"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 md:h-8 md:w-8 p-0 mobile-optimized"
                >
                  <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <CreateGroupModal
        open={showCreateGroup}
        onOpenChange={setShowCreateGroup}
        onCreateGroup={handleCreateGroup}
      />
      
      <JoinGroupModal
        open={showJoinGroup}
        onOpenChange={setShowJoinGroup}
        onJoinGroup={handleJoinGroup}
      />
    </div>
  );
}