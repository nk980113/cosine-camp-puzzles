'use client';

import { socket } from '@/hooks/useSocketIO';
import { createContext } from 'react';

export const SocketContext = createContext(socket);
