
import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface RoomContextType {
  roomId: string | null;
  isConnected: boolean;
  participants: string[];
  joinRoom: (id: string) => void;
  leaveRoom: () => void;
  sendCodeUpdate: (code: string, language: string) => void;
  receivedCode: string | null;
  receivedLanguage: string | null;
}

const RoomContext = createContext<RoomContextType>({
  roomId: null,
  isConnected: false,
  participants: [],
  joinRoom: () => {},
  leaveRoom: () => {},
  sendCodeUpdate: () => {},
  receivedCode: null,
  receivedLanguage: null,
});

export const useRoom = () => useContext(RoomContext);

// This is a mock implementation since we don't have a real backend yet
export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const [receivedCode, setReceivedCode] = useState<string | null>(null);
  const [receivedLanguage, setReceivedLanguage] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const joinRoom = (id: string) => {
    // In a real implementation, we would connect to a WebSocket server here
    setRoomId(id);
    setIsConnected(true);
    setParticipants(prev => [...prev, currentUser?.displayName || 'Anonymous']);
    
    // Mock implementation for demo purposes
    console.log(`Joined room: ${id}`);
  };

  const leaveRoom = () => {
    if (socket) {
      socket.disconnect();
    }
    setSocket(null);
    setRoomId(null);
    setIsConnected(false);
    setParticipants([]);
    setReceivedCode(null);
    setReceivedLanguage(null);
  };

  const sendCodeUpdate = (code: string, language: string) => {
    // In a real implementation, we would send the code to the WebSocket server
    console.log(`Sending code update for room ${roomId}`);
    
    // Mock receiving the code back (simulating another user)
    if (roomId) {
      setReceivedCode(code);
      setReceivedLanguage(language);
    }
  };

  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const value = {
    roomId,
    isConnected,
    participants,
    joinRoom,
    leaveRoom,
    sendCodeUpdate,
    receivedCode,
    receivedLanguage,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};
