import { Auth0UserInputDTO } from "./dto/user.dto";

export const validateAuth0UserInput = (userInput: Auth0UserInputDTO) => {
    let { firstName, lastName, userAuth0Id, ...userMetadata} = userInput;
    const validatedMetadata = {};

    for(const value in userMetadata){
        if(userMetadata[value]){
            validatedMetadata[value] = userMetadata[value]
        }
    }

    console.log("validatedMetadata", validatedMetadata)
    return {
        given_name: firstName,
        family_name: lastName,
        ...(Object.keys(validatedMetadata).length && { user_metadata: validatedMetadata})
    }
}