import Link from "next/link";

export default function Logout() {
    return <div className='p-6'>
        <Link href='/logout/confirm' className='text-7xl font-semibold'>確定登出請按此</Link>
    </div>;
}