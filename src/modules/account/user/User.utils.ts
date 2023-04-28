import { Auth0UserInputDTO, UserAddressDTO } from './dto/user.dto';

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
export const getTokenWithoutBearer = (token: string) => {
  if (!token) {
    return;
  }
  return token.replace('Bearer ', '').replace('bearer ', '');
};

export const validateOSUserInput = (userInput: Auth0UserInputDTO) => {
  const address: UserAddressDTO = JSON.parse(userInput.address);
  const userDetail = {
    first_name: userInput.firstName,
    last_name: userInput.lastName,
    job_title_id: parseInt(userInput.jobTitleId),
    phone_number: userInput.phoneNumber,
    website: userInput.website,
    sellers_permit_id: userInput.sellersPermitId,
    address1: address.address1,
    address2: address.address2,
    city: address.city,
    country: address.country,
    state: address.state,
    zipcode: address.zipcode,
    company_name: address.companyName,
    mobile_phone: address.mobileNumber,
    fax: address.faxNumber,
    sellers_permit_file: '',
    seller_permit_image: userInput.sellerPermitImage,
  };
  return userDetail;
};
