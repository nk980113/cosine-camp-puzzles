'use client';

import { EventStatusContext, EventStatusDispatchContext } from '@/contexts/EventStatusContext';
import { socket } from '@/hooks/useSocketIO';
import React, { useEffect, useState } from 'react';

export default function EventStatusContextProvider({ children }: { children: React.ReactNode }) {
    const [status, setStatus] = useState<0 | 1 | 2>(0);
    
    useEffect(() => {
        function onStatus(started: 0 | 1 | 2) {
            console.log(started)
            setStatus(started);
        }
        socket.on('status', onStatus);

        return () => {
            socket.off('status', onStatus);
        };
    }, []);
    
    return (
        <EventStatusContext.Provider value={status}>
            <EventStatusDispatchContext.Provider value={setStatus}>
                {children}
            </EventStatusDispatchContext.Provider>
        </EventStatusContext.Provider>
    );
}