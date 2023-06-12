import { gql } from 'graphql-request';
import { validatePageFilter } from 'src/graphql/utils/pagination';
import { VendorCategoriesDto } from 'src/modules/categories/dto/categories';

export const vendorCategoriesQuery = (filter: VendorCategoriesDto): string => {
  const vendorFilter = `filter: { metadata: { key: "vendorId", value: "${filter.shopId}" } }`;
  const categoryLevel = filter.categoryLevel || 1;
  const pagination = validatePageFilter(filter);
  return gql`
    query {
      categories(${pagination}, level: ${categoryLevel}) {
        edges {
          node {
            id
            name
            parent {
              products(
                ${vendorFilter}
              ) {
                totalCount
              }
            }
            products(${vendorFilter}) {
              totalCount
            }
          }
        }
      }
    }
  `;
};
