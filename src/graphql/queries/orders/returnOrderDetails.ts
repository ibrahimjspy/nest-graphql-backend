import { gql } from 'graphql-request';
const MetadataItemFragmentDoc = gql`
  fragment MetadataItem on MetadataItem {
    key
    value
  }
`;
const InvoiceFragmentDoc = gql`
  fragment Invoice on Invoice {
    id
    number
    createdAt
    url
    status
  }
`;
const WarehouseFragmentDoc = gql`
  fragment Warehouse on Warehouse {
    __typename
    id
    name
  }
`;
const StockFragmentDoc = gql`
  fragment Stock on Stock {
    __typename
    id
    quantity
    quantityAllocated
    warehouse {
      ...Warehouse
    }
  }
  ${WarehouseFragmentDoc}
`;
const OrderLineFragmentDoc = gql`
  fragment OrderLine on OrderLine {
    __typename
    id
    isShippingRequired
    allocations {
      __typename
      id
      quantity
      warehouse {
        __typename
        id
        name
      }
    }
    variant {
      __typename
      id
      quantityAvailable
      preorder {
        endDate
      }
      stocks {
        ...Stock
      }
      product {
        __typename
        id
        isAvailableForPurchase
      }
    }
    productName
    productSku
    quantity
    quantityFulfilled
    quantityToFulfill
    unitDiscount {
      __typename
      amount
      currency
    }
    unitDiscountValue
    unitDiscountReason
    unitDiscountType
    undiscountedUnitPrice {
      __typename
      currency
      gross {
        __typename
        amount
        currency
      }
      net {
        __typename
        amount
        currency
      }
    }
    unitPrice {
      __typename
      gross {
        __typename
        amount
        currency
      }
      net {
        __typename
        amount
        currency
      }
    }
    thumbnail {
      __typename
      url
    }
  }
  ${StockFragmentDoc}
`;
const FulfillmentFragmentDoc = gql`
  fragment Fulfillment on Fulfillment {
    id
    __typename
    lines {
      __typename
      id
      quantity
      orderLine {
        ...OrderLine
      }
    }
    fulfillmentOrder
    status
    trackingNumber
    warehouse {
      __typename
      id
      name
    }
  }
`;
const MoneyFragmentDoc = gql`
  fragment Money on Money {
    __typename
    amount
    currency
  }
`;
const AddressFragmentDoc = gql`
  fragment Address on Address {
    __typename
    city
    cityArea
    companyName
    country {
      __typename
      code
      country
    }
    countryArea
    firstName
    id
    lastName
    phone
    postalCode
    streetAddress1
    streetAddress2
  }
`;
const MetadataFragmentDoc = gql`
  fragment Metadata on ObjectWithMetadata {
    metadata {
      ...MetadataItem
    }
    privateMetadata {
      ...MetadataItem
    }
  }
  ${MetadataItemFragmentDoc}
`;
const OrderEventFragmentDoc = gql`
  fragment OrderEvent on OrderEvent {
    __typename
    id
    amount
    shippingCostsIncluded
    date
    email
    emailType
    invoiceNumber
    discount {
      valueType
      value
      reason
      amount {
        amount
        currency
      }
      oldValueType
      oldValue
      oldAmount {
        amount
        currency
      }
    }
    relatedOrder {
      id
      number
    }
    message
    quantity
    transactionReference
    type
    user {
      __typename
      id
      email
      firstName
      lastName
    }
    app {
      __typename
      id
      name
      appUrl
    }
    lines {
      __typename
      quantity
      itemName
      discount {
        valueType
        value
        reason
        amount {
          amount
          currency
        }
        oldValueType
        oldValue
        oldAmount {
          amount
          currency
        }
      }
      orderLine {
        __typename
        id
        productName
        variantName
      }
    }
  }
`;
const OrderDetailsFragmentDoc = gql`
  fragment OrderDetails on Order {
    __typename
    id
    token
    ...Metadata
    billingAddress {
      ...Address
    }
    giftCards {
      events {
        id
        type
        orderId
        balance {
          initialBalance {
            ...Money
          }
          currentBalance {
            ...Money
          }
          oldInitialBalance {
            ...Money
          }
          oldCurrentBalance {
            ...Money
          }
        }
      }
    }
    isShippingRequired
    canFinalize
    created
    customerNote
    discounts {
      id
      type
      calculationMode: valueType
      value
      reason
      amount {
        ...Money
      }
    }
    events {
      ...OrderEvent
    }
    fulfillments {
      ...Fulfillment
    }
    lines {
      ...OrderLine
    }
    number
    isPaid
    paymentStatus
    shippingAddress {
      ...Address
    }
    deliveryMethod {
      __typename
      ... on ShippingMethod {
        __typename
        id
      }
      ... on Warehouse {
        id
        clickAndCollectOption
      }
    }
    shippingMethod {
      __typename
      id
    }
    shippingMethodName
    collectionPointName
    shippingPrice {
      __typename
      gross {
        __typename
        amount
        currency
      }
    }
    status
    subtotal {
      __typename
      gross {
        ...Money
      }
      net {
        ...Money
      }
    }
    total {
      __typename
      gross {
        ...Money
      }
      net {
        ...Money
      }
      tax {
        ...Money
      }
    }
    actions
    totalAuthorized {
      ...Money
    }
    totalCaptured {
      ...Money
    }
    totalBalance {
      ...Money
    }
    undiscountedTotal {
      __typename
      net {
        ...Money
      }
      gross {
        ...Money
      }
    }
    user {
      __typename
      id
      email
    }
    userEmail
    shippingMethods {
      __typename
      id
      name
      price {
        ...Money
      }
      active
      message
    }
    invoices {
      ...Invoice
    }
    channel {
      __typename
      isActive
      id
      name
      currencyCode
      slug
      defaultCountry {
        __typename
        code
      }
    }
    isPaid
  }
  ${MetadataFragmentDoc}
  ${AddressFragmentDoc}
  ${MoneyFragmentDoc}
  ${OrderEventFragmentDoc}
  ${FulfillmentFragmentDoc}
  ${OrderLineFragmentDoc}
  ${InvoiceFragmentDoc}
`;

export const returnOrderDetailsQuery = (orderId: string) => {
  return gql`
      query OrderDetails {
        order(id: "${orderId}") {
          ...OrderDetails
        }
      }
      ${OrderDetailsFragmentDoc}
    `;
};
