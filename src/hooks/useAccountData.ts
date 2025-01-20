'use client';

import { AccountContext, AccountDispatchContext } from '@/contexts/AccountContext';
import { useContext } from 'react';

export default function useAccountData() {
    return [useContext(AccountContext), useContext(AccountDispatchContext)] as const;
}