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
 * @returns {object} return valid user detail object with exact usermetada key names.
 */
export const validateAuth0UserInput = (userInput: Auth0UserInputDTO) => {
  const { firstName, lastName, userAuth0Id, ...userMetadata } = userInput;
  const metadataKeyNames = {
    jobTitleId: 'job_title_id',
    phoneNumber: 'phone_number',
    resaleCertificate: 'resale_certificate',
    sellerPermitImage: 'seller_permit_image',
    sellersPermitId: 'sellers_permit_id',
    website: 'website',
    address: 'address',
    stripeCustomerId: 'stripe_customer_id',
  };
  const validatedMetadata = {};

  for (const value in userMetadata) {
    if (userMetadata[value]) {
      const keyName = metadataKeyNames[value];
      validatedMetadata[keyName] = userMetadata[value];
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

/**
 * Remove Bearer or bearer string from token string
 * @param {string} token - paramter of string type
 * @returns {string} return token without bearer text.
 */
export const tokenWithoutBearer = (token:string) => {
    if(!token){
        return;
    }
    return token
    .replace('Bearer ', '')
    .replace('bearer ', '');
}