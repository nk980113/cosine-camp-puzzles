export type ClientToServer = {
    login(token: string, cb: (name: string) => void): void;
    logout(): void;
    createAccount(name: string, pw: string, slides: string, coord: [number, number]): void;
    joinLeaderboard(cb: (data: [string, number][]) => void): void;
    leaveLeaderboard(): void;
    ready(): void;
    startEvent(): void;
    checkReady(cb: (ready: 0 | 1 | 2) => void): void;
    checkAnswer(lv: 1 | 2 | 3 | 4 | 5, ans: string | [number, number]): void;
    endEvent(): void;
};

export type ServerToClient = {
    status(started: 0 | 1 | 2): void;
    leaderboardUpdate(data: [string, number][]): void;
    levelUp(level: 0 | 1 | 2 | 3 | 4 | 5): void;
};

export type SocketData = {
    token?: string;
    name?: string;
};
