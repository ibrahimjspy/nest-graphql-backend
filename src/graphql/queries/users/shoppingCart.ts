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
      order_info {
        vendor_name
        vendor_id
        city
        state
        country
        minimum_order_amount
        number_of_items
        products {
          name
          id
          slug
          style_no
          selected_color
          unit_price
          pack_quantity
          total_quantity
          total_bill
          image_url
        }
        promotion_list {
          discount_percentage
          minimum_order
          offer_duration
        }
      }
    }
  `;
};

export const shoppingCartQuery = (id: string) => {
  return graphqlQueryCheck(federationQuery(id), mockQuery(), 'true');
};
