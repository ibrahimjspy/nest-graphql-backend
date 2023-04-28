import { gql } from 'graphql-request';
import { shippingZoneFragment } from '../../../fragments/checkout/shipping/shippingZone';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';
import { validatePageFilter } from 'src/graphql/utils/pagination';

export const getShippingZonesQuery = (pagination: PaginationDto): string => {
  const validatePagination = validatePageFilter(pagination);
  return gql`
    query ShippingZone {
      shippingZones(${validatePagination}) {
        edges {
          node {
            ...ShippingZone
          }
        }
      }
    }
    ${shippingZoneFragment}
  `;
};
