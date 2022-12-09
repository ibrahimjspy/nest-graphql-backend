import { gql } from 'graphql-request';
import { deleteImportedProductsDTO } from 'src/modules/importList/dto/products';

export const deleteImportedProductMutation = (
  productData: deleteImportedProductsDTO,
) => {
  const { shopId, productIds } = productData;
  return gql`
    mutation {
      deleteImportedProduct(Input: { shopId: "${shopId}", productIds: ${JSON.stringify(
    productIds,
  )} }) {
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
