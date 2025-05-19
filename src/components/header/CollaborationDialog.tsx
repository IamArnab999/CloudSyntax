
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRoom } from '@/contexts/RoomContext';

interface CollaborationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export const CollaborationDialog: React.FC<CollaborationDialogProps> = ({ 
  isOpen, 
  onOpenChange,
  onClose 
}) => {
  const { joinRoom } = useRoom();
  const [newRoomId, setNewRoomId] = useState('');

  const handleCreateRoom = () => {
    const randomId = Math.random().toString(36).substring(2, 10);
    joinRoom(randomId);
    onClose();
  };

  const handleJoinRoom = () => {
    if (newRoomId.trim()) {
      joinRoom(newRoomId.trim());
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
  );
};
