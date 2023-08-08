import * as dotenv from 'dotenv';
dotenv.config();

export const RedisConfig = {
  host: process.env.REDIS_HOST || 'localhost', // Redis server host
  port: Number(process.env.REDIS_PORT) || 6379, // Redis server port
  ttl: Number(process.env.REDIS_TTL) || 8400, // Default cache TTL in seconds
  max: Number(process.env.REDIS_MAX) || 1000,
};
