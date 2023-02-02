import { gql } from 'graphql-request';
import { pushToStoreDTO } from 'src/modules/productStore/dto/products';

export const pushToStoreMutation = (pushToStoreInput: pushToStoreDTO) => {
  const { productIds, shopId, storefrontId } = pushToStoreInput;
  return gql`
    mutation {
      createProducts(
        Input: {
          productIds: ${JSON.stringify(productIds)}
          shopId: "${shopId}"
          productStoreId: "${storefrontId}"
        }
      ) {
        count
        __typename
        error {
          message
          code
        }
      }
    }
  `;
};
