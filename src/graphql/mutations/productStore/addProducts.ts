import { gql } from 'graphql-request';
import { addToProductStoreDTO } from 'src/modules/productStore/dto/products';

export const addToProductStoreMutation = (
  productData: addToProductStoreDTO,
) => {
  const { shopId, productId, vendorId } = productData;
  return gql`
        mutation {
        addToProductStore(
            Input: {
            shopId: "${shopId}"
            productId: "${productId}"
            vendorId:"${vendorId}"
            }
        ) {
            __typename
            ... on StoredProductType {
            shopId
            product {
                id
                name
                variants {
                id
                }
            }
            }
            ... on ResultError {
            message
            errors
            }
        }
        }
    `;
};
