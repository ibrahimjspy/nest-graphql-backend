import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (number: number): string => {
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
        shipping_methods {
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
      }
    }
  `;
};
// returns carousel query based on federation and mock check
export const checkoutQuery = () => {
  return graphqlQueryCheck(federationQuery(2), mockQuery(), 'true');
};
