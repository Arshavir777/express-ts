import { User } from "../model";

declare module 'express-session' {
    interface SessionData {
        currentUserId: User['id'];
    }
}

export {};
