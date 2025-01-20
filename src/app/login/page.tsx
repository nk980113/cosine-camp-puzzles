'use client';

import { redirect } from '@/actions/expose';
import { getTokenByNameAndPassword } from '@/actions/readAccounts';
import useAccountData from '@/hooks/useAccountData';
import { useActionState } from 'react';

export default function Login() {
    const [_, setAccountData] = useAccountData();
    const [display, action, pending] = useActionState<React.ReactNode, FormData>(async (_: any, formData: FormData) => {
        const token = await getTokenByNameAndPassword(formData);
        if (token) {
            document.cookie = `token=${token}; max-age=86400`;
            const team = formData.get('team') as string;
            setAccountData([token, team]);
            await redirect(team === 'admin' ? '/admin' : '/event');
        }

        return <div className='text-red-400 flex place-content-center'>組別或密碼錯誤</div>;
    }, null);
    return <div className='min-h-[600px] flex flex-col place-content-center'>
        <form action={action} className='flex flex-col w-60 space-y-5 *:text-xl [&>input]:border-solid [&>input]:border-[1px] [&>input]:border-blue-900 [&>input]:rounded-md [&>input]:p-1'>
            <input placeholder='組別' name='team' required />
            <input placeholder='密碼' name='key' required />
            <button disabled={pending}>登入</button>
        </form>
        {display}
    </div>;
}