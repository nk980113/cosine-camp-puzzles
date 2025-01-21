'use client';

import { socket } from "@/hooks/useSocketIO";
import { useActionState } from "react";

export default function SingleInputBox({ lv }: { lv: 1 | 2 | 5 }) {
    const [, action, pending] = useActionState<void, FormData>((_, formData) => {
        console.log(formData.get('ans'));
        socket.emit('checkAnswer', lv as any, formData.get('ans') as string);
    }, undefined);
    return <form action={action} className="[&>input]:border-solid [&>input]:border-[1px] [&>input]:border-blue-900 [&>input]:rounded-md [&>input]:p-1">
        <input placeholder='解答' name='ans' disabled={pending} />
    </form>
}