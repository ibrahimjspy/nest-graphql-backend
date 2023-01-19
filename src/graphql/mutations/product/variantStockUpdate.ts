import { gql } from 'graphql-request';
import { DEFAULT_WAREHOUSE_ID } from 'src/constants';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bMutation = (productVariantId: string, quantity: number) => {
  return gql`
    mutation {
      productVariantStocksUpdate(
        variantId: "${productVariantId}"
        stocks: [
          {
            warehouse: "${DEFAULT_WAREHOUSE_ID}"
            quantity: ${quantity}
          }
        ]
      ) {
        productVariant {
          stocks {
            quantity
            warehouse {
              id
            }
          }
        }
        errors {
          code
          message
        }
      }
    }
  `;
};

const b2cMutation = (productVariantId: string, quantity: number) => {
  return gql`
      mutation {
        productVariantStocksUpdate(
          variantId: "${productVariantId}"
          stocks: [
            {
              warehouse: "${DEFAULT_WAREHOUSE_ID}"
              quantity: ${quantity}
            }
          ]
        ) {
          productVariant {
            stocks {
              quantity
              warehouse {
                id
              }
            }
          }
          errors {
            code
            message
          }
        }
      }
    `;
};

export const productVariantStockUpdateMutation = (
  productVariantId: string,
  quantity: number,
  isb2c = '',
) => {
  return graphqlQueryCheck(
    b2bMutation(productVariantId, quantity),
    b2cMutation(productVariantId, quantity),
    isb2c,
  );
};
