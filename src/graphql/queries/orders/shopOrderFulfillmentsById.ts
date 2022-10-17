import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (id: string): string => {
  return gql`
    query{
      marketplaceOrder(
        filter: {
          id: "${id}"
        }
      )
      {
        orderId
        fulfillmentStatus
        orderBundles{
          bundle{
            id
            variants{
              variant{
                id
                product{
                  name
                  media{
                    url
                  }
                }
                attributes{
                  attribute{
                    name
                  }
                  values{
                    name
                  }
                }
                pricing{
                  price{
                    gross{
                      currency
                      amount
                    }
                  }
                }
                media{
                  url
                }
              }
              quantity
            }
          }
          quantity
        }
        fulfillments{
          id
          fulfillmentId
          fulfillmentBundles{
            bundle{
              id
              variants{
                variant{
                  id
                  product{
                    name
                    media{
                      url
                    }
                  }
                  attributes{
                    attribute{
                      name
                    }
                    values{
                      name
                    }
                  }
                  pricing{
                    price{
                      gross{
                        currency
                        amount
                      }
                    }
                  }
                  media{
                    url
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
  `;
};
// returns shop orders query based on federation and mock check
export const shopOrderFulfillmentsQuery = (id: string) => {
  return graphqlQueryCheck(federationQuery(id), federationQuery(id));
};
