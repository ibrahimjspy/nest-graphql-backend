import { gql } from 'graphql-request';
import { deleteFromProductStoreDTO } from 'src/modules/productStore/dto/products';

export const deleteFromProductStoreMutation = (
  productData: deleteFromProductStoreDTO,
) => {
  const { shopId, productIds } = productData;
  return gql`
    mutation {
      deleteFromProductStore(Input: { shopId: "${shopId}", productIds:
       ${JSON.stringify(productIds)} }) {
        __typename
        ... on ResultData {
          message
        }
        ... on ResultError {
          message
          errors
        }
      }
    }
  `;
};
