import { PrismaClient } from "@prisma/client";
import { Redis } from "@upstash/redis";

const prismaClientSingleton = () => {
  console.log("prisma db connecting...");
  return new PrismaClient();
};

const redisClientSingleton = () => {
  const redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  return redisClient;
};

declare global {
  var db: undefined | ReturnType<typeof prismaClientSingleton>;
  var redisClient: undefined | ReturnType<typeof redisClientSingleton>;
}
const db = globalThis.db ?? prismaClientSingleton();
const redisClient = globalThis.redisClient ?? redisClientSingleton();

export { redisClient };
export default db;

if (process.env.NODE_ENV !== "production") {
  globalThis.redisClient = redisClient;
  globalThis.db = db;
}
