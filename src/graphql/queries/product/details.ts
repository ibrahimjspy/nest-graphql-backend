import { gql } from 'graphql-request';
import { DEFAULT_CHANNEL } from 'src/constants';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { ProductDetailsDto } from 'src/modules/product/dto/product.dto';

const b2bQuery = (filter: ProductDetailsDto): string => {
  const productIdentifier = filter.productId
    ? `id: "${filter.productId}"`
    : `slug: "${filter.productSlug}"`;
  return gql`
    query {
      product(${productIdentifier}, channel: "${DEFAULT_CHANNEL}") {
        name
        id
        attributes{
          attribute{
            name
          }
          values{
            name
          }
        }
        slug
        media {
          url
        }
        description
        defaultVariant {
          sku
          id
          attributes {
            attribute {
              name
            }
            values {
              name
            }
          }
          pricing {
            price {
              gross {
                currency
                amount
              }
            }
          }
        }
        variants {
          media{
            url
          }
          id
          attributes {
            attribute {
              name
            }
            values {
              name
            }
          }
          pricing{
            price {
              net {
                amount
                currency
              }
            }
            onSale
            discount{
              gross{
                amount
                currency
              }
            }
          }
        }
      }
    }
  `;
};

const b2cQuery = b2bQuery;

export const getProductDetailsQuery = (filter, isb2c = false) => {
  return graphqlQueryCheck(b2bQuery(filter), b2cQuery(filter), isb2c);
};
