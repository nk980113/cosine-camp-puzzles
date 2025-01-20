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

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server<ClientToServer, ServerToClient, {}, SocketData>(httpServer);

    io.on('connection', (socket) => {
        socket.on('login', (token, cb) => {
            socket.data.token = token;
            socket.join(token);
            cb(accData.find(([t]) => t === token)![1]);
            console.log(`login ${token}`);
        });

        socket.on('logout', () => {
            if (socket.data.token) {
                socket.leave(socket.data.token);
                delete socket.data.token;
                console.log('logout');
            }
        });
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