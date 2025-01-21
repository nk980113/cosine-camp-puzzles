'use client';
import { getPresentation } from "@/actions/readAccounts";
import EventLevels from "@/components/EventLevels";
import useEventStatus from "@/hooks/useEventStatus";
import useSocketIO from "@/hooks/useSocketIO";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Event() {
    const [status, setStatus] = useState(0);
    const [slides, setSlides] = useState('https://example.com');
    const [socket, connected] = useSocketIO();
    const [eventStatus] = useEventStatus();
    const [level, setLevel] = useState(0);
    useEffect(() => {
        if (eventStatus === 1) {
            socket.on('levelUp', setLevel);
            return () => {
                socket.off('levelUp', setLevel);
            }
        }
    });
    useEffect(() => {
        if (connected) socket.emitWithAck('checkReady').then(setStatus);
    }, [connected]);
    useEffect(() => {
        if (status === 1) getPresentation(document.cookie.split(';').find((v) => v.startsWith('token='))?.slice(6)!).then((slides) => {
            setSlides(slides);
        });
    }, [status]);
    if (status === 2) return <div className='p-6'>
        <h1 className='text-7xl font-semibold'>現在不在開放時間內;(</h1>
    </div>;
    if (status === 1) {
        if (eventStatus < 2) return <div className='p-6 flex flex-col flex-wrap space-y-5 place-content-center *:text-center [&>p]:text-xl [&>input]:border-solid [&>input]:border-[1px] [&>input]:border-blue-900 [&>input]:rounded-md [&>input]:p-1 [&>img]:m-auto'>
            {eventStatus === 1 && <EventLevels level={level as any} />}
            <h1 className='text-7xl font-semibold'>注意事項</h1>
            <p>過程中可以查看任何網站、翻閱講義。</p>
            <p>過程中可以查看<Link href={slides} className='underline underline-offset-2' target='_blank'>簡報</Link>。</p>
            <p>活動時間共40分鐘。</p>
            <p>活動共五部分，配分分別為15、5、5、20、15。</p>
            <p>過程中會給兩張紙，一張寫解題理由，最後收回，另一張作為筆記用。</p>
            <p>每題解開的分數為該題配分4/5倍，若理由正確則多給1/5倍。</p>
            <p>過程中可以要求統一給提示，但所有在提示後解開該題的人分數減配分1/5倍。</p>
            <p>若較困難的題目可能有多個提示，若較顯然的題目則不給予提示。</p>
        </div>;
        return <h1 className='text-7xl font-semibold'>活動結束了...</h1>;
    }
    return <div className='p-6'>
        <button className='text-7xl font-semibold' onClick={() => {
            socket.emit('ready');
            setStatus(1);
        }}>按我準備</button>
    </div>;
}
