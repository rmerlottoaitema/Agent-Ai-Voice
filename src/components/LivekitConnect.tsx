import React, { useState, useEffect, useRef } from "react";
import { Room, createLocalTracks, RemoteParticipant, RemoteAudioTrack, RemoteTrackPublication, RemoteTrack } from "livekit-client";
import Control from "./Control";
import Header from "./Header";
import ParticipantsCard from "./ParticipantsCard";
import DebugInfo from "./DebugInfo";
import { disconnectAgentFromRoom, token } from "../services/server";


export default function LiveKitConnect() {

  const [status, setStatus] = useState<string>('Disconnected');
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);


  useEffect(() => {
    if (!room) return;

    const subscribeParticipant = (participant: RemoteParticipant) => {

      participant.audioTrackPublications.forEach((publication: any) => {
        if (publication.isSubscribed && publication.track?.kind === "audio") {
          const audioTrack = publication.track as RemoteAudioTrack;
          const el = audioTrack.attach();
          el.autoplay = true;
          document.body.appendChild(el);
        }

        // Listener track audio
        publication.on(
          "subscribed",
          (track: RemoteTrack, pub: RemoteTrackPublication) => {
            if (track.kind === "audio") {
              const audioTrack = track as RemoteAudioTrack;
              const el = audioTrack.attach();
              el.autoplay = true;
              document.body.appendChild(el);
            }
          }
        );
      });

      // Listener track
      participant.on(
        "trackSubscribed",
        (track: RemoteTrack, pub: RemoteTrackPublication) => {
          if (track.kind === "audio") {
            const audioTrack = track as RemoteAudioTrack;
            const el = audioTrack.attach();
            el.autoplay = true;
            document.body.appendChild(el);
          }
        }
      );
    };

    room.on("participantConnected", (participant: RemoteParticipant) => {
      console.log("🎉 Participant connected:", participant.identity);
      subscribeParticipant(participant);
    });

    room.remoteParticipants.forEach(subscribeParticipant);


    // Cleanup
    return () => {
      room.removeAllListeners();

    };
  }, [room]);



  const joinRoom = async () => {
    setStatus("Joining room...");
    try {
      // Get token
      const data = await token()
      setStatus("Connecting to room...");

      // Create and connect a new room
      const r = new Room();

      // Aggiungi listener
      r.on("connected", () => {
        console.log("✅ Room connected successfully");
        setParticipants(Array.from(r.remoteParticipants.values()));
      });

      await r.connect(import.meta.env.VITE_LIVEKIT_URL, data.token);

      // Pubblica audio locale
      try {
        const localTracks = await createLocalTracks({
          audio: true,
          video: false
        });

        for (const track of localTracks) {
          await r.localParticipant.publishTrack(track);
        }
        console.log("🎤 Local audio published");
      } catch (audioError) {
        console.warn("Could not publish local audio:", audioError);
      }

      setRoom(r);
      setStatus("Connected");

    } catch (err) {
      console.error("Connection error:", err);
      setStatus("Error: " + (err as Error).message);
    }
  };

  const disconnectRoom = async () => {
    if (room) {
      await room.disconnect();
      setRoom(null);
      setParticipants([]);
      setStatus("Disconnected");
    }
  };

  const disconnectAgent = async (agentName?: string) => {
    try {
      const agentToDisconnect = agentName || participants.find(p => p.identity !== room?.localParticipant.identity)?.identity;

      if (!agentToDisconnect) {
        console.log("No agents to disconnect");
        return;
      }
      await disconnectAgentFromRoom(agentToDisconnect)

    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  const disconnectAllAgents = async () => {
    for (const participant of participants) {
      if (participant.identity !== room?.localParticipant.identity) {
        await disconnectAgent(participant.identity);
      }
    }
  };

  return (
    <React.Fragment>
      <Header />
      <Control joinRoom={joinRoom} room={room} isConnecting={false} disconnectRoom={disconnectRoom} participants={participants} disconnectAllAgents={disconnectAllAgents} status={status} />
      <ParticipantsCard participants={participants} room={room} disconnectAgent={disconnectAgent} />
      <DebugInfo room={room} connectionQuality={"excellent"} />
    </React.Fragment>
  );
}