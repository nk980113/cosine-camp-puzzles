export type ClientToServer = {
    login(token: string, cb: (name: string) => void): void;
    logout(): void;
};

export type ServerToClient = {

};

export type SocketData = {
    token?: string;
};
