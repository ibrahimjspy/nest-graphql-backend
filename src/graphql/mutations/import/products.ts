import { gql } from 'graphql-request';
import { importProductsDTO } from 'src/modules/Import/dto/products';

export const importProductsMutation = (productData: importProductsDTO) => {
  const { shopId, productId, productVariantIds } = productData;
  return gql`
    mutation {
    importProduct(
        Input: {
        shopId: "${shopId}",
        productId: "${productId}",
        productVariantIds: ${JSON.stringify(productVariantIds)}
        }
    ) {
        __typename
        ... on ImportProductType {
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
