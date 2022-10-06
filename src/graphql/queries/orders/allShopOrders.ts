import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (): string => {
  return gql`
    query{
      marketplaceShops{
        edges{
          node{
            id
            name
            orders{
              id
              orderId
              fulfillmentStatus
              orderBundles{
                bundle{
                  id
                  variants{
                    variant{
                      id
                      pricing{
                        price{
                          gross
                          {
                            currency
                            amount
                          }
                        }
                      }
                    }
                    quantity
                  }
                }
                quantity
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
