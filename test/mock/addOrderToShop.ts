export const mockCheckoutBundles = {
  data: {
    marketplaceCheckout: {
      __typename: 'CheckoutBundlesType',
      checkoutId:
        'Q2hlY2tvdXQ6YjFiZjhkZTgtNDI4NC00YjBlLTljNGEtOTI1MzY0YmNhMTYy',
      userEmail: 'VXNlcjo0',
      checkoutBundles: [
        {
          checkoutBundleId: 'c111ece1-b4a6-490b-a14e-732e94907c0b',
          isSelected: false,
          quantity: 1,
          bundle: {
            id: '85ed9a70-18bc-49e1-8a7b-2ce3bf6ba799',
            name: 'product variant bundle',
            description: 'bundle description',
            slug: 'product-variant-bundle',
            productVariants: [
              {
                quantity: 1,
                productVariant: {
                  id: 'UHJvZHVjdFZhcmlhbnQ6MzE0',
                  name: 'UHJvZHVjdFZhcmlhbnQ6MzE0',
                  sku: null,
                },
              },
              {
                quantity: 1,
                productVariant: {
                  id: 'UHJvZHVjdFZhcmlhbnQ6MzEz',
                  name: 'UHJvZHVjdFZhcmlhbnQ6MzEz',
                  sku: null,
                },
              },
              {
                quantity: 1,
                productVariant: {
                  id: 'UHJvZHVjdFZhcmlhbnQ6MzEy',
                  name: 'UHJvZHVjdFZhcmlhbnQ6MzEy',
                  sku: null,
                },
              },
            ],
            shop: {
              id: '1',
              name: 'defaultShop',
              madeIn: 'Luxemburg',
              shippingMethods: [],
            },
          },
        },
        {
          checkoutBundleId: '0c2cde24-a7e0-48df-83e4-97e2fc56f3ea',
          isSelected: false,
          quantity: 1,
          bundle: {
            id: '242c73c2-6a4c-4a03-9475-e553ec4fce2f',
            name: 'product variant bundle',
            description: 'bundle description',
            slug: 'product-variant-bundle',
            productVariants: [
              {
                quantity: 1,
                productVariant: {
                  id: 'UHJvZHVjdFZhcmlhbnQ6MzEx',
                  name: 'UHJvZHVjdFZhcmlhbnQ6MzEx',
                  sku: null,
                },
              },
              {
                quantity: 1,
                productVariant: {
                  id: 'UHJvZHVjdFZhcmlhbnQ6MzEw',
                  name: 'UHJvZHVjdFZhcmlhbnQ6MzEw',
                  sku: null,
                },
              },
              {
                quantity: 1,
                productVariant: {
                  id: 'UHJvZHVjdFZhcmlhbnQ6MzA5',
                  name: 'UHJvZHVjdFZhcmlhbnQ6MzA5',
                  sku: null,
                },
              },
            ],
            shop: {
              id: '1',
              name: 'defaultShop',
              madeIn: 'Luxemburg',
              shippingMethods: [],
            },
          },
        },
        {
          checkoutBundleId: '4b8771e7-fca6-4256-ae44-3675fd926e6c',
          isSelected: true,
          quantity: 3,
          bundle: {
            id: 'a4321dd8-5aa8-4ad0-b080-1d82289d9d2b',
            name: 'product variant bundle',
            description: 'bundle description',
            slug: 'product-variant-bundle',
            productVariants: [
              {
                quantity: 1,
                productVariant: {
                  id: 'UHJvZHVjdFZhcmlhbnQ6Njk4MzE=',
                  name: 'UHJvZHVjdFZhcmlhbnQ6Njk4MzE=',
                  sku: null,
                },
              },
              {
                quantity: 1,
                productVariant: {
                  id: 'UHJvZHVjdFZhcmlhbnQ6Njk4MzA=',
                  name: 'UHJvZHVjdFZhcmlhbnQ6Njk4MzA=',
                  sku: null,
                },
              },
              {
                quantity: 1,
                productVariant: {
                  id: 'UHJvZHVjdFZhcmlhbnQ6Njk4Mjk=',
                  name: 'UHJvZHVjdFZhcmlhbnQ6Njk4Mjk=',
                  sku: null,
                },
              },
              {
                quantity: 1,
                productVariant: {
                  id: 'UHJvZHVjdFZhcmlhbnQ6Njk4Mjg=',
                  name: 'UHJvZHVjdFZhcmlhbnQ6Njk4Mjg=',
                  sku: null,
                },
              },
            ],
            shop: {
              id: '285',
              name: 'Olgyn',
              madeIn: '',
              shippingMethods: [
                {
                  id: '60df2d64-95bb-4978-b6d0-0f4fba332487',
                  shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6MQ==',
                  shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjE=',
                },
              ],
            },
          },
        },
      ],
      selectedMethods: [
        {
          method: {
            id: '60df2d64-95bb-4978-b6d0-0f4fba332487',
            shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6MQ==',
            shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjE=',
          },
          shop: {
            id: '285',
            name: 'Olgyn',
          },
        },
      ],
    },
  },
};

export const mockOrderData = {
  order: {
    id: 'orderId',
    lines: [
      {
        id: 'lineId1',
        variant: {
          id: 'UHJvZHVjdFZhcmlhbnQ6MzE0',
        },
      },
      {
        id: 'lineId2',
        variant: {
          id: 'UHJvZHVjdFZhcmlhbnQ6MzEz',
        },
      },
      {
        id: 'lineId3',
        variant: {
          id: 'UHJvZHVjdFZhcmlhbnQ6MzEy',
        },
      },
      {
        id: 'lineId4',
        variant: {
          id: 'UHJvZHVjdFZhcmlhbnQ6MzEx',
        },
      },
      {
        id: 'lineId5',
        variant: {
          id: 'UHJvZHVjdFZhcmlhbnQ6MzEw',
        },
      },
      {
        id: 'lineId6',
        variant: {
          id: 'UHJvZHVjdFZhcmlhbnQ6MzA5',
        },
      },
      {
        id: 'lineId7',
        variant: {
          id: 'UHJvZHVjdFZhcmlhbnQ6Njk4MzA=',
        },
      },
      {
        id: 'lineId8',
        variant: {
          id: 'UHJvZHVjdFZhcmlhbnQ6Njk4Mjk=',
        },
      },
      {
        id: 'lineId9',
        variant: {
          id: 'UHJvZHVjdFZhcmlhbnQ6Njk4Mjg=',
        },
      },
      {
        id: 'lineId10',
        variant: {
          id: 'UHJvZHVjdFZhcmlhbnQ6Njk4MzE=',
        },
      },
    ],
  },
};

export const expectedOrdersByShop = [
  {
    shippingMethodId: 'U2hpcHBpbmdNZXRob2RUeXBlOjE=',
    shopId: '1',
    orderId: 'orderId',
    marketplaceOrderBundles: [
      {
        bundleId: '85ed9a70-18bc-49e1-8a7b-2ce3bf6ba799',
        quantity: 1,
        orderlineIds: ['lineId1', 'lineId2', 'lineId3'],
      },
      {
        bundleId: '242c73c2-6a4c-4a03-9475-e553ec4fce2f',
        quantity: 1,
        orderlineIds: ['lineId4', 'lineId5', 'lineId6'],
      },
    ],
  },
  {
    shippingMethodId: 'U2hpcHBpbmdNZXRob2RUeXBlOjE=',
    shopId: '285',
    orderId: 'orderId',
    marketplaceOrderBundles: [
      {
        bundleId: 'a4321dd8-5aa8-4ad0-b080-1d82289d9d2b',
        quantity: 3,
        orderlineIds: ['lineId10', 'lineId7', 'lineId8', 'lineId9'],
      },
    ],
  },
];
