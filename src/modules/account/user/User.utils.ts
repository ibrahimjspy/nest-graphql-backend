import { Auth0UserInputDTO } from './dto/user.dto';

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
    ...(Object.keys(validatedMetadata).length && {
      user_metadata: validatedMetadata,
    }),
  };
};
