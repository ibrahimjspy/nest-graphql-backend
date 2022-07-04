import { gql } from 'graphql-request';

// Mock Queries for testing use cases
// -------->>
// Product Card query <MOCK><Apollo Server>

export const mockProductCard = () => {
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
};
// Menu Categories query <Mock>
export const mockMenuCategories = () => {
  return gql`
    query {
      main_categories {
        name
        id
        slug
        images {
          url
          label
        }
        sub_categories {
          id
          name
          slug
          sub_sub_categories {
            id
            name
            slug
          }
        }
      }
    }
  `;
};
export const aniQuery = () => {
  return gql`
    query Query {
      Page {
        media {
          siteUrl
          title {
            english
            native
          }
          description
        }
      }
    }
  `;
};
export const paramQuery = (id: number) => {
  return gql`
    query Query {
      characters(page: ${id}, filter: { name: "Morty" }) {
        info {
          count
        }
        results {
          name
        }
      }
      location(id: 1) {
        id
      }
      episodesByIds(ids: [1, 2]) {
        id
      }
    }
  `;
};
