import { Room } from "livekit-client";
import React from "react";

type DebugInfoProps = {
    room: Room | null;
    connectionQuality: string;
}

export default function DebugInfo({ room, connectionQuality }: DebugInfoProps) {
    return (
        <React.Fragment>
            {room && (
                <div className="mt-6 bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                    <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer text-slate-300 font-semibold mb-4 group-open:mb-6">
                            <span>Debug Information</span>
                            <div className="transform transition-transform group-open:rotate-180">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </summary>
                        <div className="space-y-3 text-slate-400">
                            <div className="flex justify-between">
                                <span className="font-medium">Room Name:</span>
                                <span className="font-mono text-sm bg-slate-800 px-2 py-1 rounded">
                                    {room?.name || 'Not connected'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Your Identity:</span>
                                <span className="font-mono text-sm bg-slate-800 px-2 py-1 rounded">
                                    {room?.localParticipant.identity || 'Unknown'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Connection Quality:</span>
                                <span className={`font-medium ${connectionQuality === 'excellent' ? 'text-green-400' :
                                    connectionQuality === 'good' ? 'text-yellow-400' : 'text-red-400'
                                    }`}>
                                    {connectionQuality}
                                </span>
                            </div>
                        </div>
                    </details>
                </div>
            )
            }
        </React.Fragment>
    )
}