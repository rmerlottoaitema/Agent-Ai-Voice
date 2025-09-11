import { Participant } from "livekit-client";
import { Users, Volume2 } from "lucide-react";

type ParticipantsCardProps = {
    participants: Participant[]
    room: any
    disconnectAgent: (identity: any) => void
}


export default function ParticipantsCard({ participants, room, disconnectAgent }: ParticipantsCardProps) {

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
                <Users className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">
                    Participants ({participants.length})
                </h2>
            </div>

            <div className="space-y-3">
                {participants.length > 0 ? (
                    participants.map((participant: Participant) => (
                        <div
                            key={participant.sid}
                            className="group bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/10 transition-all duration-200 hover:shadow-lg"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shadow-lg ${participant.identity === room?.localParticipant.identity
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                                            : participant.identity.includes('ai-agent')
                                                ? 'bg-gradient-to-r from-green-500 to-teal-600'
                                                : 'bg-gradient-to-r from-gray-500 to-slate-600'
                                            }`}>
                                            {participant.identity.charAt(0).toUpperCase()}
                                        </div>
                                        {participant.isSpeaking && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                                                <Volume2 className="w-2 h-2 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold text-white">
                                                {participant.identity}
                                            </span>
                                            {participant.identity === room?.localParticipant.identity && (
                                                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full font-medium">
                                                    You
                                                </span>
                                            )}
                                            {participant.identity.includes('ai-agent') && (
                                                <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full font-medium">
                                                    AI Agent
                                                </span>
                                            )}
                                        </div>
                                        {participant.isSpeaking && (
                                            <div className="flex items-center space-x-2 mt-1">
                                                <div className="flex space-x-1">
                                                    <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse" />
                                                    <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                                                    <div className="w-1 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                                                </div>
                                                <span className="text-green-400 text-sm">Speaking</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {participant.identity !== room?.localParticipant.identity && (
                                    <button
                                        onClick={() => disconnectAgent(participant.identity)}
                                        className="opacity-0 group-hover:opacity-100 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                                    >
                                        Disconnect
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-300 text-lg">No participants in room</p>
                        <p className="text-slate-300 text-sm mt-2">The room is waiting for someone to connect</p>
                    </div>
                )}
            </div>
        </div>

    )
}