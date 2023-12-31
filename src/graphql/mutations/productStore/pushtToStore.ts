import { gql } from 'graphql-request';
import { PushToStoreDto } from 'src/modules/shop/modules/productStore/dto/products';

export const pushToStoreMutation = (pushToStoreInput: PushToStoreDto) => {
  const { products, shopId, storefrontId } = pushToStoreInput;
  return gql`
    mutation {
      createProducts(
        Input: {
          products: ${JSON.stringify(products)
            .replace(/"id"/g, 'id')
            .replace(/"category"/g, 'category')
            .replace(/"name"/g, 'name')
            .replace(/"images"/g, 'images')
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
