/**
 * It takes a start time, gets the difference between the start time and the current time, and returns
 * the difference in milliseconds
 * @param start - The start time of the function.
 * @returns the difference between the start time and the current time in milliseconds.
 */
export const getDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};
