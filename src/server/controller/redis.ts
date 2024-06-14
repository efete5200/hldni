import { redisClient } from "@/config/db";

const EXPIRATION_SEC = 60 * 6;

export const setSerial = async (key: string, value: string) => {
  try {
    await redisClient.set(key, value, { ex: EXPIRATION_SEC });
  } catch (error) {
    throw error;
  }
};

export const getSerial = async (key: string) => {
  try {
    return await redisClient.get(key);
  } catch (error) {
    throw error;
  }
};

export const deleteSerial = async (key: string) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    throw error;
  }
};
