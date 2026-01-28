import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL as string,
});

redisClient.on("connect", () => {
    console.log(" Redis connected");
});

redisClient.on("error", (err) => {
    console.error("Redis error", err);
});

export async function connectRedis() {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
}

export default redisClient;
