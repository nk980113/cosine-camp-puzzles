'use client';

import { socket } from "@/hooks/useSocketIO";
import { useActionState } from "react";

export default function CoordInput4({ x, y, setCoord, floor, setFloor }: { x: string, y: string, setCoord: (coord: [string, string]) => void, floor: number, setFloor: (floor: number) => void }) {
    const [, action, pending] = useActionState<void, any>(() => {
        if (x && y) socket.emit('checkAnswer', 4, [Number(x), Number(y)]);
    }, undefined);
    return <form action={action} className="flex flex-col space-y-5">
        <label>樓層：{floor <= 0 ? `B${-floor + 1}` : floor === 4 ? 'R' : floor}</label>
        <label>x：<input type="number" value={x} onChange={(ev) => { if (floor === -1) setCoord([ev.target.value, y]); }} name='x' className="border-solid border-[1px] border-blue-900 rounded-md p-1" /></label>
        <label>y：<input type="number" value={y} onChange={(ev) => { if (floor === -1) setCoord([x, ev.target.value]); }} name='y' className="border-solid border-[1px] border-blue-900 rounded-md p-1" /></label>
        <button type="button" disabled={pending} onClick={() => {
            setFloor(floor - 1);
            return false;
        }}>下樓</button>
        <button disabled={pending} onClick={() => {
            if (floor !== -1) {
                if (floor < 4) setFloor(floor + 1);
                return false;
            }
        }}>上樓</button>
    </form>
}