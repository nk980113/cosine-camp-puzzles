'use client';

import useAccountData from '@/hooks/useAccountData';
import useSocketIO from '@/hooks/useSocketIO';
import { useEffect } from 'react';

export default function SocketHandler() {
    const [[token], setAccountData] = useAccountData();

    const [socket, connected] = useSocketIO();

    useEffect(() => {
        if (connected) {
            if (token) socket.emit('login', token, (name) => {
                setAccountData([token, name]);
            });
            else socket.emit('logout');
        }
    }, [token, connected]);

    return null;
}