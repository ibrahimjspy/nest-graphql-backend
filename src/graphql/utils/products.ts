/**
 * Get the ISO format of a date before a specific number of days.
 * @param {number} daysBefore - The number of days before the current date.
 * @returns {string} The ISO formatted date (YYYY-MM-DD) before the specified number of days.
 */
export const getISODateBeforeDays = (daysBefore) => {
  const today = new Date();
  const targetDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - daysBefore,
    today.getHours(),
    today.getMinutes(),
    today.getSeconds(),
    today.getMilliseconds(),
  );
  return targetDate.toISOString();
};
