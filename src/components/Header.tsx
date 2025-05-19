
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRoom } from '@/contexts/RoomContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from './header/ThemeToggle';
import { CollaborationButton } from './header/CollaborationButton';
import { CollaborationDialog } from './header/CollaborationDialog';
import { RoomStatus } from './header/RoomStatus';
import { UserProfile } from './header/UserProfile';
import { MobileMenu } from './header/MobileMenu';

export const Header: React.FC = () => {
  const { leaveRoom } = useRoom();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleLeaveRoom = () => {
    leaveRoom();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-background border-b border-border py-4 sticky top-0 z-50">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/">
            <h1 className="text-xl font-bold">CloudSyntax</h1>
          </Link>
          <RoomStatus />
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          
          <CollaborationButton 
            onOpenDialog={handleOpenDialog}
            onLeaveRoom={handleLeaveRoom}
          />
          
          <UserProfile onSignOut={closeMobileMenu} />
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
        <MobileMenu
          onClose={closeMobileMenu}
          onOpenCollaboration={handleOpenDialog}
        />
      )}

      {/* Collaboration dialog */}
      <CollaborationDialog 
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        onClose={handleCloseDialog}
      />
    </header>
  );
};
