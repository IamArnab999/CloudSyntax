
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRoom } from '@/contexts/RoomContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Link, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

export const Header: React.FC = () => {
  const { currentUser, signOut } = useAuth();
  const { roomId, joinRoom, leaveRoom, isConnected, participants } = useRoom();
  const { theme, toggleTheme } = useTheme();
  const [newRoomId, setNewRoomId] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    const randomId = Math.random().toString(36).substring(2, 10);
    joinRoom(randomId);
    setDialogOpen(false);
  };

  const handleJoinRoom = () => {
    if (newRoomId.trim()) {
      joinRoom(newRoomId.trim());
      setDialogOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleNavigateToAuth = () => {
    navigate('/auth');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-background border-b border-border py-4 sticky top-0 z-50">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/">
            <h1 className="text-xl font-bold">CloudSyntax</h1>
          </Link>
          {isConnected && (
            <div className="hidden sm:flex gap-2 items-center">
              <span className="bg-green-500 text-white px-2 py-0.5 text-xs rounded-full">
                Room: {roomId}
              </span>
              <span className="text-xs text-muted-foreground">
                {participants.length} participant{participants.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-2">
          <Toggle 
            variant="outline"
            size="sm"
            pressed={theme === 'dark'}
            onPressedChange={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </Toggle>
          
          {isConnected ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-500" 
              onClick={leaveRoom}
            >
              Leave Room
            </Button>
          ) : (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">Collaborate</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Start Collaboration</DialogTitle>
                  <DialogDescription>
                    Create a new room or join an existing one to collaborate in real-time.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="roomId" className="text-right">
                      Room ID
                    </Label>
                    <Input
                      id="roomId"
                      value={newRoomId}
                      onChange={(e) => setNewRoomId(e.target.value)}
                      placeholder="Enter room ID"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={handleCreateRoom}>
                    Create New Room
                  </Button>
                  <Button onClick={handleJoinRoom}>Join Room</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          
          {currentUser ? (
            <div className="flex items-center gap-2">
              <img 
                src={currentUser.user_metadata?.avatar_url || 'https://www.gravatar.com/avatar/?d=mp'}
                alt={currentUser.user_metadata?.username || 'User'}
                className="w-8 h-8 rounded-full"
              />
              <div className="hidden lg:block text-sm">
                {currentUser.user_metadata?.username || 'User'}
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Button onClick={handleNavigateToAuth}>
              Sign in
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile navigation menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border z-50 py-4 px-6 shadow-md">
          <div className="flex flex-col gap-4">
            {isConnected && (
              <div className="flex gap-2 items-center">
                <span className="bg-green-500 text-white px-2 py-0.5 text-xs rounded-full">
                  Room: {roomId}
                </span>
                <span className="text-xs text-muted-foreground">
                  {participants.length} participant{participants.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <Toggle 
                variant="outline"
                size="sm"
                pressed={theme === 'dark'}
                onPressedChange={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </Toggle>
              
              {isConnected ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-500" 
                  onClick={() => {
                    leaveRoom();
                    setMobileMenuOpen(false);
                  }}
                >
                  Leave Room
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setDialogOpen(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  Collaborate
                </Button>
              )}
            </div>
            
            {currentUser ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <img 
                    src={currentUser.user_metadata?.avatar_url || 'https://www.gravatar.com/avatar/?d=mp'}
                    alt={currentUser.user_metadata?.username || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="text-sm">
                    {currentUser.user_metadata?.username || 'User'}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleNavigateToAuth}
                className="w-full"
              >
                Sign in
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
