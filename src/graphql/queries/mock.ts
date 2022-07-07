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
// Product Collections mock query
export const MockCardCollection = () => {
  return gql`
    query {
      products_collection {
        id
        name
        related_categories {
          id
          name
          slug
        }
      }
    }
  `;
};
// Single product mock query for quick view and product description
export const MockSingleProduct = () => {
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
          ships_from
          min_order
          products
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
// <------>
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
