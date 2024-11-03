import { registerEnv } from '../utils';

export default async () => {
    registerEnv('.env.test');
};
