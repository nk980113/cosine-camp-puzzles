'use client';

import { AccountContext, AccountDispatchContext } from '@/contexts/AccountContext';
import React, { useEffect, useState } from 'react';

export default function AccountContextProvider({ children }: { children: React.ReactNode }) {
    const [accountData, setAccountData] = useState<[token?: string, name?: string]>([]);
    useEffect(() => {
        setAccountData([document.cookie.split(';').find((v) => v.startsWith('token='))?.slice(6)]);
    }, []); 
    
    return (
        <AccountContext.Provider value={accountData}>
            <AccountDispatchContext.Provider value={setAccountData}>
                {children}
            </AccountDispatchContext.Provider>
        </AccountContext.Provider>
    );
}