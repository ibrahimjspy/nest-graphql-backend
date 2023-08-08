import { gql } from 'graphql-request';
import { DEFAULT_THUMBNAIL_SIZE } from 'src/constants';
import { attributeFragment } from 'src/graphql/fragments/attributes';
import { pageInfoFragment } from 'src/graphql/fragments/pageInfo';
import { pricingFragment } from 'src/graphql/fragments/pricing';
import { productDetailsFragment } from 'src/graphql/fragments/product';
import { validatePageFilter } from 'src/graphql/utils/pagination';
import {
  getProductAttributeFilter,
  getProductsSortBy,
  getVendorIdMetadataFilter,
} from 'src/graphql/utils/products';
import { ProductFilterDto } from 'src/modules/product/dto';

export const productByCollectionsQuery = (filter: ProductFilterDto): string => {
  const SHAROVE_FULFILLMENT_ATTRIBUTE_SLUG = 'issharovefulfillment';
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
    {
      collections(first: ${
        filter.collections.length
      }, filter: { ids: ${JSON.stringify(filter.collections)} }) {
        edges {
          node {
            id
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
                pageInfo {
                  ... PageInfo
                }
                totalCount
                edges {
                  node {
                    ... Product
                    attribute(slug:"${SHAROVE_FULFILLMENT_ATTRIBUTE_SLUG}") {
                      ... Attribute
                    }
                    defaultVariant {
                      id
                      pricing {
                        ... Price
                      }
                    }
                    variants {
                      id
                      attributes {
                        ... Attribute
                      }
                    }
                    thumbnail(size: ${DEFAULT_THUMBNAIL_SIZE}) {
                      url
                  }
                }
              }
            }
          }
        }
      }
    }
    ${productDetailsFragment}
    ${pricingFragment}
    ${attributeFragment}
    ${pageInfoFragment}
  `;
};
