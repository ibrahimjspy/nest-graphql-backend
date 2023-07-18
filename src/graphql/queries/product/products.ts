import { gql } from 'graphql-request';
import { DEFAULT_THUMBNAIL_SIZE } from 'src/constants';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { attributeFragment } from 'src/graphql/fragments/attributes';
import { categoryFragment } from 'src/graphql/fragments/category';
import { pageInfoFragment } from 'src/graphql/fragments/pageInfo';
import { pricingFragment } from 'src/graphql/fragments/pricing';
import { productDetailsFragment } from 'src/graphql/fragments/product';
import { validatePageFilter } from 'src/graphql/utils/pagination';
import {
  getProductAttributeFilter,
  getProductsSortBy,
} from 'src/graphql/utils/products';
import { ProductFilterDto } from 'src/modules/product/dto';

export const b2bQuery = (filter: ProductFilterDto): string => {
  const PRODUCT_LISTING_CHANNEL = 'default-channel';
  const SHAROVE_FULFILLMENT_ATTRIBUTE_SLUG = 'issharovefulfillment';
  const pageFilter = validatePageFilter(filter);
  const categoryFilter = filter['category'] ? `"${filter['category']}"` : '';
  const metadataFilter = filter.vendorId
    ? ` metadata: [{ key: "vendorId", value: "${filter.vendorId}" }]`
    : '';
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
          channel:"${PRODUCT_LISTING_CHANNEL}"
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
    ${productDetailsFragment}
    ${pricingFragment}
    ${attributeFragment}
    ${pageInfoFragment}
  `;
};

export const b2cQuery = (filter: ProductFilterDto): string => {
  const pageFilter = validatePageFilter(filter);
  const categoryFilter = filter['category'] ? `"${filter['category']}"` : '';
  return gql`
    query {
      products(
        ${pageFilter}
        filter: {
          ids: ${JSON.stringify(filter.productIds || [])}
          isAvailable: true,
          categories: [${categoryFilter}]
        }
      ) {
        pageInfo {
          ... PageInfo
        }
        totalCount
        edges {
          node {
            ... Product
            category {
              ... Category
            }
            defaultVariant {
              id
              channelListings {
                price {
                  amount
                }
              }
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
    ${productDetailsFragment}
    ${attributeFragment}
    ${pricingFragment}
    ${pageInfoFragment}
    ${categoryFragment}
  `;
};
export const productsQuery = (filter: ProductFilterDto) => {
  return graphqlQueryCheck(b2bQuery(filter), b2cQuery(filter));
};
