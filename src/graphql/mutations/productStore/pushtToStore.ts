import { gql } from 'graphql-request';
import { pushToStoreDTO } from 'src/modules/productStore/dto/products';

export const pushToStoreMutation = (pushToStoreInput: pushToStoreDTO) => {
  const { products, shopId, storefrontId } = pushToStoreInput;
  return gql`
    mutation {
      createProducts(
        Input: {
          products: ${JSON.stringify(products)
            .replace(/"id"/g, 'id')
            .replace(/"category"/g, 'category')
            .replace(/"name"/g, 'name')
            .replace(/"media"/g, 'media')
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
