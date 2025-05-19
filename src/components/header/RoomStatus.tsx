
import React from 'react';
import { useRoom } from '@/contexts/RoomContext';

export const RoomStatus: React.FC = () => {
  const { roomId, isConnected, participants } = useRoom();

  if (!isConnected) return null;

  return (
    <div className="hidden sm:flex gap-2 items-center">
      <span className="bg-green-500 text-white px-2 py-0.5 text-xs rounded-full">
        Room: {roomId}
      </span>
      <span className="text-xs text-muted-foreground">
        {participants.length} participant{participants.length !== 1 ? 's' : ''}
      </span>
    </div>
  );
};
