import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (userId: string): string => {
  // query linking with backend
  return gql`
  query {
    marketplaceCheckout(
      Input: {
        userId: "${userId}"
      }
    ) {
      bundles {
        bundle {
          id
          shop {
            id
          }
        }
        isSelected
      }
      checkoutId
      userId
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
