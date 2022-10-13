import { Logger } from '@nestjs/common';
import * as time from './time';

/**
 * It takes a name, a callback, and any number of parameters, and returns the result of the callback
 * after logging the time it took to execute Synchronously.
 * @param {string} name - The name of the function you want to log the time for.
 * @param callback - The function to be called.
 * @param params - {
 * @returns A function that takes a callback and params and returns a promise.
 */
export const logTimeSync = (name: string, callback, ...params) => {
  const start = process.hrtime();
  const logger = new Logger(name);

  const response = callback(...params);
  logger.log(`${time.getDurationInMilliseconds(start)} ms`);

  return response;
};

/**
 * It takes a name, a callback, and any number of parameters, and returns the result of the callback
 * after logging the time it took to execute Asynchronously.
 * @param {string} name - The name of the function you want to log the time for.
 * @param callback - The function to be called.
 * @param params - {
 * @returns A function that takes a callback and params and returns a promise.
 */
export const logTime = async (name: string, callback, ...params) => {
  const start = process.hrtime();
  const logger = new Logger(name);

  const response = await callback(...params);
  logger.log(`${time.getDurationInMilliseconds(start)} ms`);

  return response;
};
