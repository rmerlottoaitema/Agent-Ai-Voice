import { Wifi, WifiOff } from "lucide-react";
import { useState } from "react";

export default function StatusCard() {

    const [status, setStatus] = useState('Disconnected');
    const [connectionQuality, setConnectionQuality] = useState('excellent');


    const getStatusColor = (status) => {
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
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
                {getConnectionIcon()}
                <span className={`font-semibold text-lg ${getStatusColor(status)}`}>
                    {status}
                </span>
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