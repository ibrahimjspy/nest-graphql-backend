import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (): string => {
  return gql`
    query {
      marketplaceShops {
        edges {
          node {
            name
            orders {
              id
              orderId
              fulfillmentStatus
              orderBundles {
                bundle {
                  variants {
                    variant {
                      pricing {
                        price {
                          gross {
                            currency
                            amount
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
};

// returns shop orders query based on federation and mock check
export const allShopOrdersQuery = () => {
  return graphqlQueryCheck(federationQuery(), federationQuery());
};
