


export const token = async() => {
    const response = await fetch("https://12ce002c93cc.ngrok-free.app/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomName: "sip-room",
          participantName: `user-${Date.now()}`
        }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to get token");

    return data
}

export const disconnectAgentFromRoom =  async(agentToDisconnect:string | undefined) => {
     const response = await fetch("https://12ce002c93cc.ngrok-free.app/disconnect-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentName: agentToDisconnect,
          roomName: "sip-room"
        }),
      });

      const data = await response.json();
      return data
}