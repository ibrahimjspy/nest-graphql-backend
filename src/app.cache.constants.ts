import * as dotenv from 'dotenv';
dotenv.config();

export const RedisConfig = {
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  ttl: Number(process.env.REDIS_TTL) || 8400, // Default cache TTL in seconds
  max: Number(process.env.REDIS_MAX) || 1000,
};
