'use server';

import { readFile } from 'node:fs/promises';

async function read<T>(file: string): Promise<T> {
    return JSON.parse(await readFile(file, 'utf-8'));
}

export async function getTokenByNameAndPassword(formData: FormData) {
    return (await read<[string, string, string][]>('shared/accounts.json')).find(([, n, p]) => n === formData.get('team') && p === formData.get('key'))?.[0];
}

export async function getPresentation(token: string) {
    return (await read<{ [token: string]: { slides: string, coord: [number, number] } }>('shared/extra.json'))[token].slides;
}
