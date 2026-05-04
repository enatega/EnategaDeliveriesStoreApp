import React, { useEffect, useRef, useState } from 'react';
import Text from './Text';
import { StyleProp, TextStyle } from 'react-native';

type Props = {
    startTimeMs: number;
    totalMinutes: number;
    style?: StyleProp<TextStyle>;
};

export default function CountdownTimer({ startTimeMs, totalMinutes, style }: Props) {
    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const updateRemaining = () => {
            const elapsed = Math.floor((Date.now() - startTimeMs) / 1000);
            const remaining = Math.max(0, totalMinutes * 60 - elapsed);
            setRemainingSeconds(remaining);
        };
        updateRemaining();
        intervalRef.current = setInterval(updateRemaining, 1000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [startTimeMs, totalMinutes]);

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        const pad = (n: number) => n.toString().padStart(2, '0');
        if (hours > 0) return `${pad(hours)} : ${pad(minutes)} : ${pad(secs)}`;
        return `${pad(minutes)} : ${pad(secs)}`;
    };

    return (
        <Text style={[style, { fontVariant: ['tabular-nums'] }]}>
            {formatTime(remainingSeconds)}
        </Text>
    );
}