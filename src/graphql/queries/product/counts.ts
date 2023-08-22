import { gql } from 'graphql-request';
import { validatePageFilter } from 'src/graphql/utils/pagination';
import {
  getProductAttributeFilter,
  getProductsSortBy,
  getVendorIdMetadataFilter,
} from 'src/graphql/utils/products';
import { ProductFilterDto } from 'src/modules/product/dto';

export const productsCountQuery = (filter: ProductFilterDto): string => {
  const pageFilter = validatePageFilter(filter);
  const categoryFilter = filter['category'] ? `"${filter['category']}"` : '';
  const metadataFilter = getVendorIdMetadataFilter(filter);
  const daysBeforeFilter = filter.date
    ? `updatedAt: {gte: "${filter.date}"}`
    : '';
  const attributeFilter = getProductAttributeFilter(filter);
  const priceFilter = `price: {${
    filter.startPrice ? `gte: ${filter.startPrice}` : ''
  } ${filter.endPrice ? `lte: ${filter.endPrice}` : ''}}`;
  const openPackFilter = filter.isOpenPack
    ? ` metadata: [{ key: "isOpenPack", value: "${filter.isOpenPack}" }]`
    : '';
  const productSortBy = getProductsSortBy(filter);
  return gql`
      query {
        products(
          ${pageFilter}
          ${productSortBy}
          filter: {
            ids: ${JSON.stringify(filter.productIds || [])}
            isAvailable: true,
            categories: [${categoryFilter}]
            ${metadataFilter}
            ${daysBeforeFilter}
            ${attributeFilter}
            ${priceFilter}
            ${openPackFilter}
          }
        ) {
          totalCount
        } 
      }
    `;
};
