import { createServer } from 'node:http';
import next from 'next';
import { Server } from 'socket.io';
import type { ClientToServer, ServerToClient, SocketData } from '../shared/eventMaps';
import { readFile, writeFile } from 'node:fs/promises';

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = Number(process.env.PORT) || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port, turbo: true });
const handler = app.getRequestHandler();

const accData = JSON.parse(await readFile('shared/accounts.json', 'utf-8')) as [string, string, string][];
const extraData = JSON.parse(await readFile('shared/extra.json', 'utf-8')) as { [token: string]: { slides: string, coord: [number, number] } };
const randomPassword = Math.random().toString(16).slice(2);
const adminAcc = accData.find(([, name]) => name === 'admin');
if (adminAcc) {
    adminAcc[2] = randomPassword;
} else {
    const randomToken = Math.random().toString(16).slice(2);
    accData.push([randomToken, 'admin', randomPassword]);
}
await writeFile('shared/accounts.json', JSON.stringify(accData), 'utf-8');
console.log(`Admin password: ${randomPassword}`);

let eventStatus: 0 | 1 | 2 = 0;
let eventData: { [token: string]: number } = {};
let readyList: Set<string> = new Set;
let leaderboardData: [string, number][] = [];

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server<ClientToServer, ServerToClient, {}, SocketData>(httpServer);

    io.on('connection', (socket) => {
        socket.emit('status', eventStatus);

        socket.on('login', (token, cb) => {
            socket.data.token = token;
            socket.join(token);
            const name = accData.find(([t]) => t === token)![1];
            socket.data.name = name;
            cb(name);
            console.log(`login ${token}`);
            socket.emit('levelUp', eventData[socket.data.token!] as any)
        });

        socket.on('logout', () => {
            if (socket.data.token) {
                socket.leave(socket.data.token);
                delete socket.data.token;
                delete socket.data.name;
                console.log('logout');
            }
        });

        socket.on('createAccount', async (name, pw, slides, coord) => {
            if (socket.data.name === 'admin') {
                const randomToken = Math.random().toString(16).slice(2);
                accData.push([randomToken, name, pw]);
                extraData[randomToken] = { slides, coord };
                await writeFile('shared/accounts.json', JSON.stringify(accData), 'utf-8');
                await writeFile('shared/extra.json', JSON.stringify(extraData), 'utf-8');
            }
        });

        socket.on('joinLeaderboard', (cb) => {
            socket.join('leaderboard');
            cb(leaderboardData);
        });

        socket.on('leaveLeaderboard', () => {
            socket.leave('leaderboard');
        });

        socket.on('ready', () => {
            leaderboardData.push([socket.data.name!, 0]);
            readyList.add(socket.data.token!);
            io.to('leaderboard').emit('leaderboardUpdate', leaderboardData);
        });

        socket.on('checkReady', (cb) => {
            if (!socket.data.token) return cb(2);
            if (readyList.has(socket.data.token)) return cb(1);
            cb(Number(!!eventStatus) * 2 as 0 | 2);
        });

        socket.on('startEvent', () => {
            if (socket.data.name === 'admin') {
                eventData = Object.fromEntries([...readyList.entries()].map(([token]) => [token, 0 as number] as const));
                eventStatus = 1;
                io.emit('status', eventStatus);

                setTimeout(() => {
                    eventStatus = 2;
                    io.emit('status', eventStatus);
                    readyList = new Set;
                }, 2_400_000).unref();
            }
        });

        socket.on('checkAnswer', (lv: 1 | 2 | 3 | 4 | 5, ans: string | [number, number]) => {
            let correct = false;
            switch (lv) {
                case 1:
                    correct = (ans as string).toLowerCase() === 'over';
                    break;
                case 2:
                    correct = (ans as string).toLowerCase() === 'land';
                    break;
                case 3: {
                    const [x, y] = ans as [number, number];
                    correct = x === Math.floor(Math.log(extraData[socket.data.token!].coord[0])) && y === Math.floor(Math.log(extraData[socket.data.token!].coord[1]));
                    break;
                }
                case 4: {
                    const [x, y] = ans as [number, number];
                    correct = x === extraData[socket.data.token!].coord[0] && y === extraData[socket.data.token!].coord[1];
                    break;
                }
                case 5: {
                    correct = (ans as string).toLowerCase() === 'zazi';
                }
            }
            if (correct) {
                eventData[socket.data.token!] = lv;
                const acc = leaderboardData.find(([t]) => t === socket.data.name);
                if (acc) {
                    acc[1] = lv;
                    leaderboardData.sort(([, s1], [, s2]) => s1 - s2);
                    io.to('leaderboard').emit('leaderboardUpdate', leaderboardData);
                    io.to(socket.data.token!).emit('levelUp', eventData[socket.data.token!] as any);
                }
            }
        })

        socket.on('endEvent', () => {
            eventStatus = 0;
            io.emit('status', eventStatus);
            leaderboardData = [];
            io.to('leaderboard').emit('leaderboardUpdate', leaderboardData);
        })
    });

    httpServer
        .once('error', (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});