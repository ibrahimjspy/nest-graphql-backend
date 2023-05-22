import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';
import { validatePageFilter } from 'src/graphql/utils/pagination';

const b2cQuery = (filter: PaginationDto): string => {
  const pagination = validatePageFilter(filter);
  return gql`
    query {
      homepageEvents(${pagination}) {
        edges {
          node {
            id
            message
            type
            status
            date
            orderNumber
          }
        }
      }
    }
  `;
};

const b2bQuery = b2cQuery;
export const getOrderEventsQuery = (
  filter: PaginationDto,
  isB2C = false,
): string => {
  return graphqlQueryCheck(b2bQuery(filter), b2cQuery(filter), isB2C);
};
