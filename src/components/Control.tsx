import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Users, Phone, PhoneOff, Wifi, WifiOff, Volume2, Bot } from 'lucide-react';
import StatusCard from './StatusCard';
import { RemoteParticipant, Room } from 'livekit-client';


type ControlProps = {
  joinRoom: () => void;
  room: Room | null;
  isConnecting: boolean;
  disconnectRoom: () => void
  disconnectAllAgents: () => void
  participants: RemoteParticipant[]
  status: string
}

export default function Control({ joinRoom, room, isConnecting, disconnectRoom, disconnectAllAgents, participants, status }: ControlProps) {

  const [connectionQuality, setConnectionQuality] = useState<string>('excellent');


  const creationTime = (room as any)?.roomInfo.creationTime;
  if (creationTime) {
    const diffMs = Number(Date.now()) - Number(creationTime);
    const diffMinutes = Math.floor(diffMs / 1000 / 60);
    console.log(`La stanza è attiva da ${diffMinutes} minuti`);
  }


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected': return 'text-green-500';
      case 'Connecting...': return 'text-yellow-500';
      case 'Disconnected': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getConnectionIcon = () => {
    if (status === 'Connected') return <Wifi className="w-4 h-4 text-green-500" />;
    if (status === 'Connecting...') return <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />;
    return <WifiOff className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20 shadow-2xl">
      <StatusCard getConnectionIcon={getConnectionIcon} status={status} getStatusColor={getStatusColor} connectionQuality={connectionQuality} />
      <div className="flex flex-wrap gap-3">
        <button
          onClick={joinRoom}
          disabled={!!room || isConnecting}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          <Phone className="w-5 h-5" />
          <span>{isConnecting ? 'Connecting...' : 'Join Room'}</span>
        </button>

        <button
          onClick={disconnectRoom}
          disabled={!room}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:from-red-600 hover:to-pink-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          <PhoneOff className="w-5 h-5" />
          <span>Leave Room</span>
        </button>

        <button
          onClick={disconnectAllAgents}
          disabled={participants.length <= 1}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:from-orange-600 hover:to-red-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          <Bot className="w-5 h-5" />
          <span>Disconnect All Agents</span>
        </button>
      </div>
    </div>

  )
}