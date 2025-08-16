import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { Dashboard } from './components/Dashboard';
import { Toaster } from './components/ui/sonner';

interface User {
  id: string;
  name: string;
  email: string;
}

type AuthView = 'login' | 'signup';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<AuthView>('login');

  // Apply dark theme by default
  useEffect(() => {
    document.documentElement.classList.remove('light');
    // We don't need to add 'dark' class since our CSS is dark by default
  }, []);

  const handleLogin = (email: string, password: string) => {
    // In a real app, this would authenticate with backend
    const mockUser: User = {
      id: '1',
      name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: email
    };
    setUser(mockUser);
  };

  const handleSignup = (name: string, email: string, password: string) => {
    // In a real app, this would create account with backend
    const newUser: User = {
      id: Date.now().toString(),
      name: name,
      email: email
    };
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
    setAuthView('login');
  };

  // If user is logged in, show dashboard
  if (user) {
    return (
      <>
        <Dashboard user={user} onLogout={handleLogout} />
        <Toaster 
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: 'hsl(var(--card))',
              color: 'hsl(var(--card-foreground))',
              border: '1px solid hsl(var(--border))',
            },
          }}
        />
      </>
    );
  }

  // Otherwise show authentication forms
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {authView === 'login' ? (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToSignup={() => setAuthView('signup')}
          />
        ) : (
          <SignupForm
            onSignup={handleSignup}
            onSwitchToLogin={() => setAuthView('login')}
          />
        )}
      </div>
      <Toaster 
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
    </div>
  );
}