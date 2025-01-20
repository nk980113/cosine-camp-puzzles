'use server';

import { cookies as nextCookies } from 'next/headers';
import { redirect as nextRedirect, RedirectType } from 'next/navigation';

export async function redirect(url: string, type?: RedirectType): Promise<never> {
    return nextRedirect(url, type);
}

export async function cookies() {
    return await nextCookies();
}
