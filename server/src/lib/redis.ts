import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("connect", () => console.log("Connected to Redis"));
redisClient.on("disconnect", () => console.log("Disconnected from Redis"));
redisClient.on("error", function (error) {
  console.error(error);
});

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export const disconnectRedis = async () => {
  if (redisClient.isOpen) {
    await redisClient.disconnect();
  }
};

export const cacheData = async (key: string, data: string) => {
  await connectRedis();
  await redisClient.set(key, data);
};

export const getCachedData = async (key: string) => {
  await connectRedis();
  return await redisClient.get(key);
};

export const scanKeys = async (pattern: string) => {
  await connectRedis();
  let cursor = 0;
  const allKeys = new Set<string>();

  do {
    const { cursor: nextCursor, keys } = await redisClient.scan(cursor, {
      MATCH: pattern,
      COUNT: 100,
    });

    keys.forEach((key) => allKeys.add(String(key.split(":")[1])));
    cursor = nextCursor;
  } while (cursor !== 0);
  const keys = Array.from(allKeys);
  return { keys: keys.length > 0 ? keys : [] };
};
