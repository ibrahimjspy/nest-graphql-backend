import { gql } from 'graphql-request';
import { DEFAULT_CHANNEL } from 'src/constants';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bQuery = (slug): string => {
  return gql`
    query {
      product(slug: "${slug}", channel: "${DEFAULT_CHANNEL}") {
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

const b2cQuery = (slug): string => {
  return gql`
    query {
      product(slug: "${slug}", channel: "${DEFAULT_CHANNEL}") {
        name
        id
        category{
          id
          name
          slug
        }
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

export const productDetailsQuery = (slug: string) => {
  return graphqlQueryCheck(b2bQuery(slug), b2cQuery(slug));
};
