import { gql } from 'graphql-request';

export const productCardQuery = () => {
  // Query imported from Sailer implementation
  return gql`
    fragment ProductCardFragment on Product {
      id
      slug
      name
      translation(languageCode: $locale) {
        id
        name
      }
      thumbnail {
        ...ImageFragment
      }
      category {
        id
        name
        translation(languageCode: $locale) {
          id
          name
        }
      }
      pricing {
        onSale
        priceRange {
          start {
            gross {
              ...PriceFragment
            }
          }
          stop {
            gross {
              ...PriceFragment
            }
          }
        }
      }
    }
  `;
};
