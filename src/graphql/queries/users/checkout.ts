import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (number: string): string => {
  // query linking with backend
  return gql`
    query {
      categories(first: ${number}) {
        edges {
          node {
            name
            id
            slug
            children(first: 2) {
              edges {
                node {
                  name
                  id
                  slug
                  children(first: 2) {
                    edges {
                      node {
                        name
                        id
                        slug
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

export const checkoutQuery = (id: string) => {
  return graphqlQueryCheck(federationQuery(id), mockQuery(), 'true');
};
