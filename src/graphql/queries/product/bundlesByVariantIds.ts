import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (variantIds: Array<string>) => {
  return gql`
    query {
      bundles(
        Paginate: { first: 100 }
        Filter: {
          productVariantIds: ${JSON.stringify(variantIds)}
        }
      ) {
        ... on BundleConnectionType {
          edges {
            node {
              __typename
              id
              name
              description
              slug
              shop {
                id
                name
                email
                url
                madeIn
                minOrder
                description
                about
                returnPolicy
                storePolicy
              }
              productVariants {
                quantity
                productVariant {
                  id
                  name
                  attributes {
                    attribute {
                      name
                    }
                    values {
                      name
                    }
                  }
                  product {
                    name
                    id
                    thumbnail {
                      url
                    }
                    media {
                      url
                    }
                  }
                  pricing {
                    price {
                      net {
                        amount
                        currency
                      }
                    }
                    onSale
                    discount {
                      gross {
                        amount
                        currency
                      }
                    }
                  }
                }
              }
            }
          }
        }
        ... on ResultError {
          __typename
          errors
          message
        }
      }
    }
  `;
};

export const productBundlesByVariantIdQuery = (variantIds: Array<string>) => {
  return graphqlQueryCheck(
    federationQuery(variantIds),
    federationQuery(variantIds),
  );
};
