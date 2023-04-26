import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { shopDetailDto } from 'src/modules/shop/dto/shop';

const b2bQuery = (filter: shopDetailDto): string => {
  const shopId = filter.id ? `id: "${filter.id}"` : '';
  const shopUrl = filter.url ? `url: "${filter.url}"` : '';
  const shopEmail = filter.email ? `email: "${filter.email}"` : '';
  return gql`
  query {
    marketplaceShop(filter: {
      ${shopId}
      ${shopUrl}
      ${shopEmail}
    }) {
        id
        name
        about
        description
        madeIn
        minOrder
        url
        returnPolicy
        storePolicy
        fields {
          name
          values
        }
    }
  }`;
};

const b2cQuery = (filter: shopDetailDto): string => {
  const shopId = filter.id ? `id: "${filter.id}"` : '';
  const shopUrl = filter.url ? `url: "${filter.url}"` : '';
  const shopEmail = filter.email ? `email: "${filter.email}"` : '';

  return gql`
  query {
    marketplaceShop(filter: {
      ${shopId}
      ${shopUrl}
      ${shopEmail}
    }) {
        id
        name
        about
        description
        madeIn
        minOrder
        url
        returnPolicy
        storePolicy
        fields {
          name
          values
        }
    }
  }`;
};

export const shopDetailsV2Query = (filter: shopDetailDto, isb2c = false) => {
  return graphqlQueryCheck(b2bQuery(filter), b2cQuery(filter), isb2c);
};
