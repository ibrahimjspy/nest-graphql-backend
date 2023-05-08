import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { shopDetailsFragment } from 'src/graphql/fragments/shop';
import { createStoreDTO } from 'src/modules/shop/dto/shop';

const federationMutation = (storeInput: createStoreDTO) => {
  return gql`
    mutation{
      createMarketplaceShop(
        input: {
          name: "${storeInput['name']}"
          url: "${storeInput['url']}"
          email: "${storeInput['email']}"
          user: "${storeInput['email']}"
          description: "${storeInput['description']}"
          about: "${storeInput['about']}"
          madeIn: "${storeInput['madeIn']}"
          minOrder: ${storeInput['minOrder']}
          returnPolicy: "${storeInput['returnPolicy']}"
          storePolicy: "${storeInput['storePolicy']}"
          fields: [
            { name: "logo", values: ["${storeInput['logo']}"]}
            { name: "banner", values: ["${storeInput['banner']}"]}
            { name: "facebook", values: ["${storeInput['facebook']}"]}
            { name: "pinterest", values: ["${storeInput['pinterest']}"]}
            { name: "instagram", values: ["${storeInput['instagram']}"]}
            { name: "twitter", values: ["${storeInput['twitter']}"]}
          ]
        }
      )
      {
        ...Shop
      }
    }
    ${shopDetailsFragment}
  `;
};

export const createStoreMutation = (
  storeInput: createStoreDTO,
  isb2c = false,
) => {
  return graphqlQueryCheck(
    federationMutation(storeInput),
    federationMutation(storeInput),
    isb2c,
  );
};
