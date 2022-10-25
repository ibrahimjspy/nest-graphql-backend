/**
 * It takes an array and a key, and returns an object with the key as the key and the value as the
 * value
 * @param {any[]} list - any[] - The list of items to be hashed.
 * @param {string | any} key - The key to use to hash the list, it can be a callback and a string.
 * @returns A function that takes a list and a key and returns a dictionary.
 */
export function hash<Type>(list: Array<Type>, key: string | any) {
  const _dict = {};
  list.forEach((ele) => {
    switch (typeof key) {
      case 'function':
        _dict[key(ele)] = ele;
        break;

      default:
        _dict[ele[key]] = ele;
        break;
    }
  });
  return _dict;
}

/**
 * If the quantity is a number and greater than 0, return the quantity, otherwise return 0.
 * @param {number} quantity - number
 * @returns A function that takes a number and returns a number.
 */
export const makeQuantity = (quantity: number): number => {
  if (typeof quantity !== 'number') return quantity;
  return quantity > 0 ? quantity : 0;
};
