
import React from 'react';
import { Button } from '@/components/ui/button';
import { useRoom } from '@/contexts/RoomContext';

interface CollaborationButtonProps {
  onOpenDialog: () => void;
  onLeaveRoom: () => void;
}

export const CollaborationButton: React.FC<CollaborationButtonProps> = ({ 
  onOpenDialog,
  onLeaveRoom
}) => {
  const { isConnected } = useRoom();

  if (isConnected) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="text-red-500" 
        onClick={onLeaveRoom}
      >
        Leave Room
      </Button>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={onOpenDialog}>
      Collaborate
    </Button>
  );
};
