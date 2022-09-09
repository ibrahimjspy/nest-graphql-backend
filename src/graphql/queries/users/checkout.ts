import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (userId: string): string => {
  // query linking with backend
  return gql`
  query {
    getCheckout(
        userId: "${userId}"
    ) {
        ... on CheckoutBundlesType {
          checkoutId
          userId
          bundles {
            checkoutBundleId
            isSelected
            quantity
            bundle {
              id
              name
              description
              slug
              variants {
                quantity
                variant {
                  id
                  name
                  sku
                  images {
                    url
                  }
                  pricing {
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
              shop {
                  id
                  name
                  madeIn
              }
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

const mockQuery = () => {
  // query linking with mock server
  return gql`
    query {
      checkout_information {
        shipping_address_list {
          address_nickname
          company_name
          first_name
          last_name
          address_line_1
          address_line_2
          country
          state
          city
          zip_code
          phone_number
          default_address
        }
        vendors_info {
          vendor_name
          items_count
          ships_from
          shipping_method_list {
            method_name
            id
          }
          product_list {
            product_image_url
            product_name
            product_color
            product_price
            pack_quantity
          }
          total_bill
          discount
          promotion
        }
        reward_points
      }
      payment_method {
        store_credit
        credit_card
        paypal
      }
    }
  `;
};

export const getCheckoutQuery = (id: string) => {
  return graphqlQueryCheck(federationQuery(id), mockQuery());
};
