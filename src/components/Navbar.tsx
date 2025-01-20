'use client';

import useAccountData from '@/hooks/useAccountData';
import Link from 'next/link';

export default function Navbar() {
    const [[token, name]] = useAccountData();
    return <nav className='h-24 max-sm:h-32 bg-blue-200 place-content-center flex max-sm:flex-col max-sm:space-y-4 sm:space-x-4 px-6'>
        <Link href='/' className='text-3xl self-center text-center'>Cosine不建人解謎活動</Link>
        <div className='grow max-sm:hidden' />
        {token
            ? <Link href='/logout' className='text-xl self-center text-center'>{name ?? '已登入'} - 登出</Link>
            : <Link href='/login' className='text-xl self-center text-center'>登入</Link>}
    </nav>;
}
