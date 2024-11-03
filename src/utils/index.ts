import dotenv from 'dotenv';

export const arrayToChunks = <T>(arr: T[], chunkSize: number = 100) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
}


export const registerEnv = (path?: string) => {
    dotenv.config({ path, override: true, debug: true })
}
