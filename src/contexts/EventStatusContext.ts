'use client';

import { createContext } from 'react';

export const EventStatusContext = createContext<0 | 1 | 2>(0);
export const EventStatusDispatchContext = createContext<(state: 0 | 1 | 2) => void>(() => {});
