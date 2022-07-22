import { gql } from 'graphql-request';

export const carouselQuery = () => {
  const is_mock = process.env.MOCK;
  if (is_mock == 'false') {
    // query linking with backend
    return gql`
      query {
        categories(first: 2) {
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
  } else {
    // query linking with mock server
    return gql`
      query {
        products {
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
    `;
  }
};
