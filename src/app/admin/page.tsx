import AdminPanel from '@/components/AdminPanel';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { readFile } from 'node:fs/promises';

export default async function Admin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (token && (JSON.parse(
        await readFile('shared/accounts.json', 'utf-8')
    ) as [string, string, string][]).find(([t]) => t === token)?.[1] === 'admin') {
        return <AdminPanel />;
    }

    redirect('/login');
}