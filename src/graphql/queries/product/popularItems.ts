import { gql } from 'graphql-request';
import { DEFAULT_CHANNEL } from 'src/constants';
import { validatePageFilter } from 'src/graphql/utils/pagination';
import { ProductFilterDto } from 'src/modules/product/dto';

/**
 * Query for Top selling products.
 * @returns {string} - query
 */
export const popularItemsQuery = (filter: ProductFilterDto): string => {
  const pageFilter = validatePageFilter(filter);

  return gql`
    query {
      reportProductSales(
        ${pageFilter}
        channel: "${DEFAULT_CHANNEL}"
        period: THIS_MONTH
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
        edges {
          node {
            product {
              id
            }
          }
        }
      }
    }
  `;
};
