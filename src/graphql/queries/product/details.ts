import { gql } from 'graphql-request';
import { DEFAULT_CHANNEL, DEFAULT_THUMBNAIL_SIZE } from 'src/constants';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { attributeFragment } from 'src/graphql/fragments/attributes';
import { categoryFragment } from 'src/graphql/fragments/category';
import { categoryWithAncestors } from 'src/graphql/fragments/categoryWithAncestors';
import { mediaFragment } from 'src/graphql/fragments/media';
import { pricingFragment } from 'src/graphql/fragments/pricing';
import { productDetailsFragment } from 'src/graphql/fragments/product';
import {
  productVariantDetailsFragment,
  productVariantStockFragment,
} from 'src/graphql/fragments/productVariant';
import { ProductDetailsDto } from 'src/modules/product/dto/product.dto';

const b2bQuery = (filter: ProductDetailsDto): string => {
  const productIdentifier = filter.productId
    ? `id: "${filter.productId}"`
    : `slug: "${filter.productSlug}"`;
  return gql`
    query {
      product(${productIdentifier}, channel: "${DEFAULT_CHANNEL}") {
        ... Product
        category {
          ... Category
        }
        attributes{
          ... Attribute
        }
        media {
          ... Media
        }
        thumbnail(size: ${DEFAULT_THUMBNAIL_SIZE}) {
          url
        }
        defaultVariant {
          ... ProductVariant
          attributes {
            ... Attribute
          }
          pricing {
            ... Price
          }
        }
        variants {
          ... ProductVariant
          media{
            ... Media
          }
          attributes {
            ... Attribute
          }
          pricing{
            ... Price
          }
        }
      }
    }
    ${categoryFragment}
    ${attributeFragment}
    ${mediaFragment}
    ${pricingFragment}
    ${productVariantDetailsFragment}
    ${productDetailsFragment}
  `;
};

const b2cQuery = (filter: ProductDetailsDto): string => {
  const productIdentifier = filter.productId
    ? `id: "${filter.productId}"`
    : `slug: "${filter.productSlug}"`;
  return gql`
    query {
      product(${productIdentifier}, channel: "${DEFAULT_CHANNEL}") {
        ... Product
        category {
          ... CategoryWithAncestors
        }
        attributes{
          ... Attribute
        }
        thumbnail {
          url
        }
        media {
          ... Media
        }
        defaultVariant {
          ... ProductVariant
          attributes {
            ... Attribute
          }
          channelListings {
            price {
              amount
            }
          }
        }
        variants {
          ... ProductVariant
          media{
            ... Media
          }
          attributes {
            ... Attribute
          }
          stocks {
            ... Stock
          }
          channelListings {
            price {
              amount
            }
          }
        }
      }
    }
    ${categoryWithAncestors}
    ${attributeFragment}
    ${mediaFragment}
    ${productVariantDetailsFragment}
    ${productDetailsFragment}
    ${productVariantStockFragment}
  `;
};

export const getProductDetailsQuery = (filter, isb2c = false) => {
  return graphqlQueryCheck(b2bQuery(filter), b2cQuery(filter), isb2c);
};
