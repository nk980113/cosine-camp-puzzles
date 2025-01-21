'use client';

import { socket } from "@/hooks/useSocketIO";
import { useState, useActionState } from "react";

export default function CoordInput3({ x, y, setCoord }: { x: string, y: string, setCoord: (coord: [string, string]) => void }) {
    const [, action, pending] = useActionState<void, any>(() => {
        if (x && y) socket.emit('checkAnswer', 3, [Number(x), Number(y)]);
    }, undefined);
    return <form action={action} className="flex flex-col space-y-5">
        <label>樓層：R</label>
        <label>x：<input type="number" value={x} onChange={(ev) => { setCoord([ev.target.value, y]); }} name='x' className="border-solid border-[1px] border-blue-900 rounded-md p-1" /></label>
        <label>y：<input type="number" value={y} onChange={(ev) => { setCoord([x, ev.target.value]); }} name='y' className="border-solid border-[1px] border-blue-900 rounded-md p-1" /></label>
        <button disabled={pending}>下樓</button>
        <button disabled>無法再上樓</button>
    </form>
}