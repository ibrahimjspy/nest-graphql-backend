import { gql } from 'graphql-request';
import { DEFAULT_CHANNEL } from 'src/constants';
export const getProductSlugQuery = (productId: string): string => {
  return gql`
    query {
      product(id: "${productId}", channel: "${DEFAULT_CHANNEL}") {
        slug
      }
    }
  `;
};
