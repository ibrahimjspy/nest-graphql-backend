import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { shopDetailDTO } from 'src/modules/shop/dto/shop';

const b2bQuery = (filter: shopDetailDTO): string => {
  const shopId = filter.id ? `id: "${filter.id}"` : '';
  const shopUrl = filter.url ? `url: "${filter.url}"` : '';

  return gql`
  query {
    marketplaceShop(filter: {
      ${shopId}
      ${shopUrl}
    }) {
        id
        name
        about
        description
        madeIn
        minOrder
        url
        products {
          id
        }
        returnPolicy
        storePolicy
        fields {
          name
          values
        }
    }
  }`;
};

const b2cQuery = (filter: shopDetailDTO): string => {
  const shopId = filter.id ? `id: "${filter.id}"` : '';
  const shopUrl = filter.url ? `url: "${filter.url}"` : '';

  return gql`
  query {
    marketplaceShop(filter: {
      ${shopId}
      ${shopUrl}
    }) {
        id
        name
        about
        description
        madeIn
        minOrder
        url
        products {
          id
        }
        productVariants {
          id
        }
        returnPolicy
        storePolicy
        fields {
          name
          values
        }
    }
  }`;
};

export const shopDetailsV2Query = (filter: shopDetailDTO, isb2c = false) => {
  return graphqlQueryCheck(b2bQuery(filter), b2cQuery(filter), isb2c);
};
