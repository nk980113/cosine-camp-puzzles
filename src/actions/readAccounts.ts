'use server';

import { readFile } from 'node:fs/promises';

async function read() {
    return JSON.parse(await readFile('shared/accounts.json', 'utf-8')) as [string, string, string][];
}

export async function getTokenByNameAndPassword(formData: FormData) {
    return (await read()).find(([, n, p]) => n === formData.get('team') && p === formData.get('key'))?.[0];
}
