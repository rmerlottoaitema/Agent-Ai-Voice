import React, { useEffect, useState } from "react";
import { Room, RoomEvent, LocalAudioTrack, createLocalAudioTrack } from "livekit-client";

interface VoiceAgentProps {
  url: string;   // LiveKit server URL (wss://...)
  token: string; // Token generato dal server
}

const VoiceAgent: React.FC<VoiceAgentProps> = ({ url, token }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const initRoom = async () => {
      const room = new Room({
        // optional config
        adaptiveStream: true
      });

      room.on(RoomEvent.Connected, () => {
        console.log("Connesso al LiveKit!");
        setConnected(true);
      });

      room.on(RoomEvent.Disconnected, () => {
        console.log("Disconnesso dal LiveKit!");
        setConnected(false);
      });

      room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        if (track.kind === "audio") {
          const audioEl = document.createElement("audio");
          audioEl.srcObject = new MediaStream([track.mediaStreamTrack]);
          audioEl.autoplay = true;
          document.body.appendChild(audioEl);
        }
      });

      await room.connect(url, token);

      // Pubblica il microfono locale
      const localAudioTrack: LocalAudioTrack = await createLocalAudioTrack();
      await room.localParticipant.publishTrack(localAudioTrack);

      setRoom(room);
    };

    initRoom();

    return () => {
      room?.disconnect();
    };
  }, [url, token]);

  return (
    <div>
      {connected ? <p>Connesso all’agente vocale LiveKit!</p> : <p>Connessione in corso...</p>}
    </div>
  );
};

export default VoiceAgent;
