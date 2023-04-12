import { Auth0UserInputDTO } from './dto/user.dto';

/**
 * Get object keys length
 * @param {object} obj - paramter of object type
 * @returns {number} return the length of the object keys.
 */
export const validateObjectLength = (obj: object) => {
  return Object.keys(obj).length;
};

/**
 * Validate the user details and user metadata for checking if each key's value exist then its returned
 * @param {Auth0UserInputDTO} userInput - user details objects
 * @returns {object} return valid user detail object.
 */
export const validateAuth0UserInput = (userInput: Auth0UserInputDTO) => {
  const { firstName, lastName, userAuth0Id, ...userMetadata } = userInput;
  const validatedMetadata = {};

  for (const value in userMetadata) {
    if (userMetadata[value]) {
      validatedMetadata[value] = userMetadata[value];
    }
  }

  return {
    ...(firstName && { given_name: firstName }),
    ...(lastName && { family_name: lastName }),
    ...(validateObjectLength(validatedMetadata) && {
      user_metadata: validatedMetadata,
    }),
  };
};
