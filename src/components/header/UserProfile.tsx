
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';

interface UserProfileProps {
  onSignOut?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onSignOut }) => {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut();
    setIsLoading(false);
    if (onSignOut) onSignOut();
  };

  const handleNavigateToAuth = () => {
    navigate('/auth');
  };

  if (!currentUser) {
    return (
      <Button onClick={handleNavigateToAuth}>
        Sign in
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <img 
        src={currentUser.user_metadata?.avatar_url || 'https://www.gravatar.com/avatar/?d=mp'}
        alt={currentUser.user_metadata?.username || 'User'}
        className="w-8 h-8 rounded-full"
      />
      <div className="hidden lg:block text-sm">
        {currentUser.user_metadata?.username || 'User'}
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
            Signing out...
          </>
        ) : (
          'Sign Out'
        )}
      </Button>
    </div>
  );
};
