
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRoom } from '@/contexts/RoomContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Link, useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { currentUser, signOut } = useAuth();
  const { roomId, joinRoom, leaveRoom, isConnected, participants } = useRoom();
  const { theme, toggleTheme } = useTheme();
  const [newRoomId, setNewRoomId] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    // Generate a random room ID
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
  };

  return (
    <header className="bg-background border-b border-border py-4">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/">
            <h1 className="text-xl font-bold">CodeCompiler</h1>
          </Link>
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
        </div>
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
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
                alt={currentUser.user_metadata?.full_name || 'User'}
                className="w-8 h-8 rounded-full"
              />
              <div className="hidden md:block text-sm">
                {currentUser.user_metadata?.full_name || currentUser.email}
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
      </div>
    </header>
  );
};
