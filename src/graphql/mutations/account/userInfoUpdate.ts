import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { UserInputDTO } from 'src/modules/account/user/dto/user.dto';

const b2bMutation = (userInput: UserInputDTO) => {
  return gql`
    mutation {
      accountUpdate(input: ${JSON.stringify(userInput)
        .replace(/"firstName"/g, 'firstName')
        .replace(/"lastName"/g, 'lastName')}
      ) {
        user {
          id
          email
          firstName
          lastName
        }
      }
    }
  `;
};

const b2cMutation = (userInput: UserInputDTO) => {
  return gql`
    mutation {
      accountUpdate(input: ${JSON.stringify(userInput)
        .replace(/"firstName"/g, 'firstName')
        .replace(/"lastName"/g, 'lastName')}
      ) {
        user {
          id
          email
          firstName
          lastName
        }
      }
    }
  `;
};


export const updateUserInfoMutation = (
  userInput: UserInputDTO,
  isb2c = false,
) => {
  return graphqlQueryCheck(
    b2bMutation(userInput),
    b2cMutation(userInput),
    isb2c
  );
};
