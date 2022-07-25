import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = () => {
  return gql`
    query {
      product(slug: "apple-juice", channel: "default-channel") {
        name
        id
        slug
        media {
          url
        }
        description
        variants {
          id
          pricing {
            price {
              gross {
                currency
                amount
              }
            }
          }
          attributes {
            attribute {
              name
            }
            values {
              name
            }
          }
        }
        attributes {
          attribute {
            name
          }
          values {
            name
          }
        }
        pricing {
          priceRange {
            start {
              gross {
                currency
                amount
              }
            }
            stop {
              gross {
                currency
                amount
              }
            }
          }
        }
      }
    }
  `;
};

const mockQuery = () => {
  return gql`
    query {
      productBySlug {
        main_image
        images
        description
        product_name
        id
        slug
        style_no
        vendor_info {
          name
          id
          shipping_city
          shipping_state
          min_order
          vendor_products {
            image
            title
            description
            id
            slug
            color_variant
            sku
            resale_price
            product_cost
          }
        }
        available_sizes {
          name
          symbol
          id
          unit_price
        }
        resale_price
        product_cost
        commission
        selling_price
        is_added_to_store
        is_favorite
        is_favorite
        is_cart
        shipping_policy {
          min_days
          max_days
          flat_rate
          threshold
        }
        color_variant
        return_policy {
          returning_days
        }
      }
    }
  `;
};

export const productDetailsQuery = () => {
  return graphqlQueryCheck(federationQuery(), mockQuery());
};
