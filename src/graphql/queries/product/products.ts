import { gql } from 'graphql-request';
import { DEFAULT_THUMBNAIL_SIZE } from 'src/constants';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { attributeFragment } from 'src/graphql/fragments/attributes';
import { categoryFragment } from 'src/graphql/fragments/category';
import { pageInfoFragment } from 'src/graphql/fragments/pageInfo';
import { pricingFragment } from 'src/graphql/fragments/pricing';
import { productDetailsFragment } from 'src/graphql/fragments/product';
import { validatePageFilter } from 'src/graphql/utils/pagination';
import { ProductFilterDto } from 'src/modules/product/dto';

export const b2bQuery = (filter: ProductFilterDto): string => {
  const pageFilter = validatePageFilter(filter);
  const categoryFilter = filter['category'] ? `"${filter['category']}"` : '';
  const metadataFilter = filter.vendorId
    ? ` metadata: [{ key: "vendorId", value: "${filter.vendorId}" }]`
    : '';
  const sortBy = filter.date
    ? 'sortBy: { field: CREATED_AT, direction: DESC}'
    : '';
  const daysBeforeFilter = filter.date
    ? `updatedAt: {gte: "${filter.date}"}`
    : '';
  return gql`
    query {
      products(
        ${pageFilter}
        ${sortBy}
        filter: {
          ids: ${JSON.stringify(filter.productIds || [])}
          isAvailable: true,
          categories: [${categoryFilter}]
          ${metadataFilter}
          ${daysBeforeFilter}
        }
      ) {
        pageInfo {
          ... PageInfo
        }
        totalCount
        edges {
          node {
            ... Product
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
