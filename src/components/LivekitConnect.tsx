import React, { useState, useEffect, useRef } from "react";
import { Room, createLocalTracks, RemoteParticipant, RemoteAudioTrack, RemoteTrackPublication, RemoteTrack } from "livekit-client";
import Control from "./Control";
import Header from "./Header";
import ParticipantsCard from "./ParticipantsCard";
import { Wifi, WifiOff } from "lucide-react";
import DebugInfo from "./DebugInfo";

const LIVEKIT_URL = "wss://aitematest-fmet0mg5.livekit.cloud";

export default function LiveKitConnect() {
  const [status, setStatus] = useState("Not connected");
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);

  // DEBUG: Log dettagliato della stanza
  const logRoomInfo = (r: Room) => {
    console.log("=== ROOM INFO ===");
    console.log("Room name:", r.name);
    console.log("Room SID:", r.getSid);
    console.log("Local participant:", r.localParticipant.identity);
    console.log("Remote participants:", Array.from(r.remoteParticipants.keys()));
    console.log("Remote participants count:", r.remoteParticipants.size);
    console.log("=================");
  };

  useEffect(() => {
    if (!room) return;

    const subscribeParticipant = (participant: RemoteParticipant) => {
      // Subscribiamo tutti i track audio già presenti
      participant.audioTrackPublications.forEach((publication: any) => {
        if (publication.isSubscribed && publication.track?.kind === "audio") {
          const audioTrack = publication.track as RemoteAudioTrack;
          const el = audioTrack.attach(); // crea <audio> HTML
          el.autoplay = true;
          document.body.appendChild(el); // o un container specifico
        }

        // Listener per track audio che si sottoscrivono successivamente
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

      // Listener generale per nuovi track
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

    // Ogni volta che un nuovo partecipante entra
    room.on("participantConnected", (participant: RemoteParticipant) => {
      console.log("🎉 Participant connected:", participant.identity);
      subscribeParticipant(participant);
    });

    // Subscribe ai partecipanti già presenti
    room.remoteParticipants.forEach(subscribeParticipant);

    // Cleanup
    return () => {
      room.removeAllListeners();
    };
  }, [room]);



  const joinRoom = async () => {
    setStatus("Joining room...");
    try {
      // Ottieni token
      const response = await fetch("http://localhost:3000/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomName: "sip-room",
          participantName: `user-${Date.now()}`
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to get token");

      console.log("Token received");

      setStatus("Connecting to room...");

      // Crea e connetti alla stanza
      const r = new Room();

      // Aggiungi listener
      r.on("connected", () => {
        console.log("✅ Room connected successfully");
        logRoomInfo(r);
        setParticipants(Array.from(r.remoteParticipants.values()));
      });

      await r.connect(LIVEKIT_URL, data.token);

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
      setStatus(`Connected to room: ${r.name}`);

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

      const response = await fetch("https://f201e3bfd1b2.ngrok-free.app/disconnect-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentName: agentToDisconnect,
          roomName: "sip-room"
        }),
      });

      const data = await response.json();
      console.log("Disconnect response:", data);

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
      <Control joinRoom={joinRoom} room={room} isConnecting={false} disconnectRoom={disconnectRoom} participants={participants} disconnectAllAgents={disconnectAllAgents} />
      <ParticipantsCard participants={participants} room={room} disconnectAgent={disconnectAgent} />
      <DebugInfo room={room} connectionQuality={"excellent"} />
    </React.Fragment>
  );
}