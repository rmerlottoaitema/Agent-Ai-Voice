import React, { useState, useRef, useEffect, Ref } from "react";

export default function Timer() {

    const Ref = useRef<number | null>(null);
    const [secondsElapsed, setSecondsElapsed] = useState<number>(0);


    const formatTime = (totalSeconds: number) => {
        const minutes: number = Math.floor((totalSeconds % 3600) / 60);
        const seconds: number = totalSeconds % 60;

        return `${minutes > 9 ? minutes : "0" + minutes}:` +
            `${seconds > 9 ? seconds : "0" + seconds}`;
    };

    // Timer increment
    const startTimer = () => {
        setSecondsElapsed((prev: number) => prev + 1);
    };

    // Timer reset
    const resetTimer = () => {
        setSecondsElapsed(0);
    };

    useEffect(() => {
        Ref.current = setInterval(startTimer, 1000);

        return () => {
            if (Ref.current) clearInterval(Ref.current);
        };
    }, []);

    return (
        <React.Fragment>
            <span className="text-lg text-white">{formatTime(secondsElapsed)}</span>
        </React.Fragment>
    );
}
