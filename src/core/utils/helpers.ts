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
 * It removes the quotes from the keys of a dictionary object
 * @param {object} obj - The object to be converted to a string.
 * @returns A string with all the keys in the object without quotes.
 */
export const graphqlObjectTransform = (obj: object) => {
  if (typeof obj !== 'object')
    throw new Error('`obj` should be a dictionary object');

  const re = /"(\w+)"(?=:)/gi;
  const json_str = JSON.stringify(obj);

  return json_str.replace(re, (match: string) => match.replaceAll(/"/gi, ''));
};

/**
 * If the object is not null, is an object, and is not an array, then it is an object.
 * @param obj - The object to check
 * @returns true if an object otherwise false
 */
export const isObject = (obj) => {
  if (obj !== null && typeof obj === 'object' && !Array.isArray(obj))
    return true;
  return false;
};

/**
 * checks if the value is boolean or not
 * @param val - could be of any type
 * @returns true if it is boolean or not
 */
export const isBoolean = (val) => {
  return val === false || val === true;
};
