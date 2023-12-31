import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { mediaFragment } from 'src/graphql/fragments/media';
import { productDetailsFragment } from 'src/graphql/fragments/product';
import { updateMyProductDTO } from 'src/modules/shop/dto/myProducts';

const b2bMutation = (productUpdateInput: updateMyProductDTO) => {
  return gql`
      mutation {
        productUpdate(
            id: "${productUpdateInput.productId}"
            input: ${JSON.stringify(productUpdateInput.input)
              .replace(/"name"/g, 'name')
              .replace(/"description"/g, 'description')
              .replace(/"category"/g, 'category')}
        ) {
            product {
            ... Product
            media {
              ... Media
            }
          }
        }
      }
      ${productDetailsFragment}
      ${mediaFragment}
  `;
};

const b2cMutation = b2bMutation;

export const updateMyProductMutation = (
  productUpdateInput: updateMyProductDTO,
  isb2c = false,
) => {
  return graphqlQueryCheck(
    b2bMutation(productUpdateInput),
    b2cMutation(productUpdateInput),
    isb2c,
  );
};
