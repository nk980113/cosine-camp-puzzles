'use client';

import { redirect } from "@/actions/expose";
import useAccountData from "@/hooks/useAccountData";
import { socket } from "@/hooks/useSocketIO";
import { useEffect } from "react";

export default function ConfirmLogout() {
    const [_, setAccountData] = useAccountData();
    useEffect(() => {
        document.cookie = 'token=; max-age=0;';
        socket.emit('logout');
        setAccountData([]);
        redirect('/');
    }, []);
}