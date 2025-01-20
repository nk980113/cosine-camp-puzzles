'use client';

import { useState, useEffect } from 'react';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { ClientToServer, ServerToClient } from '../../shared/eventMaps';

export const socket: Socket<ServerToClient, ClientToServer> = io();

export default function useSocketIO() {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

            socket.on('connect', onConnect);
            socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, []);

    return [socket, isConnected] as const;
}