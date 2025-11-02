import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface AuthProps {
  onComplete: () => void;
}

export function Auth({ onComplete }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save auth state to localStorage (this is a simple implementation)
    localStorage.setItem('userAuth', JSON.stringify({
      email,
      name: isLogin ? email.split('@')[0] : name,
      loggedInAt: new Date().toISOString()
    }));
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a2438] via-[#3d3451] to-[#2a2438] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/80 border-border backdrop-blur">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-[#F2C4DE] to-[#AED8F2] rounded-2xl flex items-center justify-center mx-auto mb-2">
            <span className="text-[#2a2438] text-3xl font-bold">✓</span>
          </div>
          <CardTitle className="text-3xl text-foreground">checkpoint</CardTitle>
          <CardDescription className="text-muted-foreground">
            {isLogin ? 'Welcome back! Sign in to continue' : 'Create your account to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#F2C4DE] to-[#AED8F2] hover:opacity-90 text-[#2a2438] font-medium"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
