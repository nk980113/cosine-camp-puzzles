'use client';

import useEventStatus from "@/hooks/useEventStatus";
import useSocketIO from "@/hooks/useSocketIO";
import { Fragment, useEffect, useState } from "react";

export default function Leaderboard() {
    const [socket, connected] = useSocketIO();
    const [status] = useEventStatus();
    const [leaderboardState, setLeaderboardState] = useState([] as [string, number][]);

    useEffect(() => {
        if (connected) {
            socket.emit('joinLeaderboard', setLeaderboardState);

            socket.on('leaderboardUpdate', setLeaderboardState);
        }

        return () => {
            socket.off('leaderboardUpdate', setLeaderboardState);
            socket.emit('leaveLeaderboard');
        };
    }, [connected]);
    if (!status) {
        if (!leaderboardState.length) return <h1 className='text-7xl font-semibold'>活動尚未開始</h1>;
        return <h1 className='text-5xl font-semibold'>已準備：{leaderboardState.map(([v]) => v).join('、')}</h1>;
    }
    return (
        <>
            <h1 className='text-7xl font-semibold'>排行榜</h1>
            <div className='grid py-5 grid-cols-3 *:text-2xl *:text-center'>
                {...leaderboardState.map(([n, s], i) => <Fragment key={i}>
                    <div>{i + 1}.</div>
                    <div>{n}</div>
                    <div>{s}</div>
                </Fragment>)}
            </div>
        </>
    );
}