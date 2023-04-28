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
 * Get boolean
 * @param {object} obj - paramter of object type
 * @returns {boolean} return the true or false if Object field is all empty.
 */
export const validateAddressFields = (obj: object) => {
  return Object.values(obj).every((value) => !value);
};

/**
 * Validate the user details and user metadata for checking if each key's value exist then its returned
 * @param {Auth0UserInputDTO} userInput - user details objects
 * @info metadataKeyNames - Need to transform key names according to auth0 Key names listing in this variables
 * @info Auth0 doesn't take more than 10 fields in user_metadata that why address object is JSON.stringfy
 * @returns {object} return valid user detail object with exact usermetada key names.
 */
export const validateAuth0UserInput = (userInput: Auth0UserInputDTO) => {
  const { firstName, lastName, userAuth0Id, ...userMetadata } = userInput;
  const address = {
    zipcode: userInput.zipcode,
    address1: userInput.address1,
    address2: userInput.address2,
    city: userInput.city,
    country: userInput.country,
    state: userInput.state,
    companyName: userInput.companyName,
    faxNumber: userInput.faxNumber,
    mobileNumber: userInput.mobileNumber,
  };

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
  const validatedMetadata = {
    ...(!validateAddressFields(address) && {
      address: JSON.stringify(address),
    }),
  };

  for (const value in userMetadata) {
    const keyName = metadataKeyNames[value];
    if (userMetadata[value] && keyName) {
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
export const getTokenWithoutBearer = (token: string) => {
  if (!token) {
    return;
  }
  return token.replace('Bearer ', '').replace('bearer ', '');
};

/**
 * Get object of User Details
 * @param {Auth0UserInputDTO} userInput - user details objects
 * @returns {object} return object of user details.
 */

export const transformOSUserInput = (userInput: Auth0UserInputDTO) => {
  const userDetail = {
    first_name: userInput.firstName,
    last_name: userInput.lastName,
    job_title_id: parseInt(userInput.jobTitleId),
    phone_number: userInput.phoneNumber,
    website: userInput.website,
    sellers_permit_id: userInput.sellersPermitId,
    address1: userInput.address1,
    address2: userInput.address2,
    city: userInput.city,
    country: userInput.country,
    state: userInput.state,
    zipcode: userInput.zipcode,
    company_name: userInput.companyName,
    mobile_phone: userInput.mobileNumber,
    fax: userInput.faxNumber,
    sellers_permit_file: '',
    seller_permit_image: userInput.sellerPermitImage,
  };
  return userDetail;
};
