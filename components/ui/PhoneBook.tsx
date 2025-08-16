import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Search, UserPlus, Users, Phone, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './dialog';

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  avatar?: string;
}

interface PhoneBookProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectContacts: (contacts: Contact[]) => void;
  selectedContacts?: Contact[];
}

export function PhoneBook({ open, onOpenChange, onSelectContacts, selectedContacts = [] }: PhoneBookProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(selectedContacts.map(c => c.id)));
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading contacts from phone book
  useEffect(() => {
    if (open) {
      loadContacts();
    }
  }, [open]);

  // Filter contacts based on search
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phoneNumber.includes(searchQuery)
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  }, [searchQuery, contacts]);

  const loadContacts = async () => {
    setIsLoading(true);
    // Simulate API call to get phone contacts
    setTimeout(() => {
      const mockContacts: Contact[] = [
        { id: '1', name: 'Alice Johnson', phoneNumber: '+91 98765 43210', email: 'alice@example.com' },
        { id: '2', name: 'Bob Wilson', phoneNumber: '+91 98765 43211', email: 'bob@example.com' },
        { id: '3', name: 'Carol Davis', phoneNumber: '+91 98765 43212', email: 'carol@example.com' },
        { id: '4', name: 'David Lee', phoneNumber: '+91 98765 43213', email: 'david@example.com' },
        { id: '5', name: 'Emma Brown', phoneNumber: '+91 98765 43214', email: 'emma@example.com' },
        { id: '6', name: 'Frank Miller', phoneNumber: '+91 98765 43215', email: 'frank@example.com' },
        { id: '7', name: 'Grace Taylor', phoneNumber: '+91 98765 43216', email: 'grace@example.com' },
        { id: '8', name: 'Henry Anderson', phoneNumber: '+91 98765 43217', email: 'henry@example.com' },
        { id: '9', name: 'Ivy Chen', phoneNumber: '+91 98765 43218', email: 'ivy@example.com' },
        { id: '10', name: 'Jack Smith', phoneNumber: '+91 98765 43219', email: 'jack@example.com' },
      ];
      setContacts(mockContacts);
      setFilteredContacts(mockContacts);
      setIsLoading(false);
    }, 1000);
  };

  const toggleContact = (contactId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(contactId)) {
      newSelected.delete(contactId);
    } else {
      newSelected.add(contactId);
    }
    setSelectedIds(newSelected);
  };

  const handleConfirm = () => {
    const selectedContacts = contacts.filter(contact => selectedIds.has(contact.id));
    onSelectContacts(selectedContacts);
    onOpenChange(false);
  };

  const handleClose = () => {
    setSearchQuery('');
    onOpenChange(false);
  };

  const selectedCount = selectedIds.size;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-left">Phone Book</DialogTitle>
              <DialogDescription className="text-left text-xs uppercase tracking-wider">
                Select contacts to add to your group
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Selected Count */}
          {selectedCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {selectedCount} selected
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedIds(new Set())}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear all
              </Button>
            </div>
          )}

          {/* Contacts List */}
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No contacts found</p>
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <Card 
                  key={contact.id} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedIds.has(contact.id) 
                      ? 'ring-2 ring-primary bg-primary/5' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => toggleContact(contact.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{contact.name}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span className="truncate">{contact.phoneNumber}</span>
                        </div>
                        {contact.email && (
                          <div className="text-xs text-muted-foreground truncate">
                            {contact.email}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {selectedIds.has(contact.id) && (
                          <Badge variant="default" className="bg-primary text-primary-foreground">
                            Selected
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleContact(contact.id);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          {selectedIds.has(contact.id) ? (
                            <X className="h-4 w-4" />
                          ) : (
                            <UserPlus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <DialogFooter className="modal-mobile-enhanced dialog-footer">
          <Button variant="outline" onClick={handleClose} className="btn-mobile-full">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={selectedCount === 0}
            className="btn-money btn-mobile-full"
          >
            Add {selectedCount > 0 ? `${selectedCount} Contact${selectedCount !== 1 ? 's' : ''}` : 'Contacts'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
