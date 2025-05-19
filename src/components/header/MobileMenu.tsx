
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Moon, Sun, Loader } from 'lucide-react';
import { useRoom } from '@/contexts/RoomContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface MobileMenuProps {
  onClose: () => void;
  onOpenCollaboration: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ onClose, onOpenCollaboration }) => {
  const { currentUser, signOut } = useAuth();
  const { roomId, leaveRoom, isConnected, participants } = useRoom();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut();
    setIsLoading(false);
    onClose();
  };

  const handleNavigateToAuth = () => {
    navigate('/auth');
    onClose();
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    onClose();
  };
  
  return (
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
              onClick={handleLeaveRoom}
            >
              Leave Room
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                onOpenCollaboration();
                onClose();
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
              onClick={handleSignOut}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Signing Out...
                </>
              ) : (
                'Sign Out'
              )}
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
  );
};
