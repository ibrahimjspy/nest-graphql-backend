import { gql } from 'graphql-request';
import { pushToStoreDTO } from 'src/modules/productStore/dto/products';

export const pushToStoreMutation = (pushToStoreInput: pushToStoreDTO) => {
  const { products, shopId, storefrontId } = pushToStoreInput;
  return gql`
    mutation {
      createProducts(
        Input: {
          productIds: ${JSON.stringify(products)
            .replace(/"id"/g, 'id')
            .replace(/"category"/g, 'id')
            .replace(/"name"/g, 'id')
            .replace(/"media"/g, 'id')
            .replace(/"description"/g, 'description')}
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
