'use client';

import { createContext } from 'react';

export const AccountContext = createContext<[token?: string, name?: string]>([undefined, undefined]);
export const AccountDispatchContext = createContext<(state: [token?: string, name?: string]) => void>(() => {});
