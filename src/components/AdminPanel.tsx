'use client';

import useEventStatus from "@/hooks/useEventStatus";
import { socket } from "@/hooks/useSocketIO";
import { useActionState } from "react";

export default function AdminPanel() {
    const [status] = useEventStatus();
    const [, action, pending] = useActionState((_: void, formData: FormData) => {
        socket.emit('createAccount', formData.get('team') as string, formData.get('key') as string, formData.get('slides') as string, [Number(formData.get('x')), Number(formData.get('y'))]);
    }, undefined)
    switch (status) {
        case 0:
            return (
                <div className='flex flex-col p-8 space-x-8'>
                    <div>
                        <h1 className='text-5xl font-semibold'>建立帳戶</h1>
                        <form action={action} className='flex flex-col w-60 space-y-5 *:text-xl [&>input]:border-solid [&>input]:border-[1px] [&>input]:border-blue-900 [&>input]:rounded-md [&>input]:p-1'>
                            <input placeholder='組別' name='team' required />
                            <input placeholder='密碼' name='key' required />
                            <input placeholder='簡報' name='slides' required />
                            <input placeholder='x1' name='x' type='number' required />
                            <input placeholder='y1' name='y' type='number' required />
                            <button disabled={pending}>建立</button>
                        </form>
                    </div>
                    <button onClick={() => { socket.emit('startEvent') }}>開始活動</button>
                </div>
            );
        case 1:
            return null;
        case 2:
            return <button onClick={() => { socket.emit('endEvent') }}>結束活動</button>
    }
}