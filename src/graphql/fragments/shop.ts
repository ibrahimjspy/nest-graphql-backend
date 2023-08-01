import { gql } from 'graphql-request';

export const shopDetailsFragment = gql`
  fragment Shop on MarketplaceShop {
    id
    name
    email
    url
    madeIn
    minOrder
    description
    about
    returnPolicy
    storePolicy
    shipsFrom
    fields {
      name
      values
    }
  }
`;

export const shopBankAccountFragment = gql`
  fragment ShopBankAccount on ShopBankAccountType {
    shop
    id
    accReferId
  }
`;

export const checkoutShopDetailsFragment = gql`
  fragment Shop on MarketplaceShop {
    id
    name
    madeIn
    minOrder
    shippingMethods {
      id
      shippingMethodId
      shippingMethodTypeId
    }
    fields {
      name
      values
    }
  }
`;
