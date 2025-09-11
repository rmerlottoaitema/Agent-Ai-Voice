import { Wifi, WifiOff } from "lucide-react";
import { ReactNode, useState } from "react";
import Timer from "./Timer";

type StatusCardProps = {
    getConnectionIcon: () => ReactNode
    status: string
    getStatusColor: (status: string) => void
    connectionQuality: string
}

export default function StatusCard({ getConnectionIcon, status, getStatusColor, connectionQuality }: StatusCardProps) {



    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
                {getConnectionIcon()}
                <span className={`font-semibold text-lg ${getStatusColor(status)}`}>
                    {status}
                </span>
                {status === "Connected" && <Timer />}
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
                <div className={`w-2 h-2 rounded-full ${connectionQuality === 'excellent' ? 'bg-green-500' :
                    connectionQuality === 'good' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                <span className="text-sm">{connectionQuality} quality</span>
            </div>
        </div>

    )
}