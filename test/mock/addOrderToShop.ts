export const mockCheckoutBundles = {
  __typename: 'CheckoutBundlesType',
  checkoutId: 'Q2hlY2tvdXQ6NTE1MGEzNmQtNGY0My00NGIwLTk0ZGMtZjc0ZDg0YWY3MzVk',
  userEmail: 'azhariqbal100@mailinator.com',
  checkoutBundles: [
    {
      checkoutBundleId: 'a6adf137-af96-4eb4-bf77-5f9427d04e0a',
      isSelected: true,
      quantity: 5,
      price: 57,
      bundle: {
        id: '19c88ba8-7429-45f7-87dd-a9999803d955',
        name: 'product variant bundle',
        description: 'bundle description',
        slug: 'product-variant-bundle',
        product: {
          name: '2PCS BODYSUIT',
          id: 'UHJvZHVjdDoxMzQwNA==',
          thumbnail: {
            url: 'http://localhost:8000/media/202107/V/cee9ddef-ddf0-11eb-8038-002590aaee66_V.jpg',
          },
          media: [
            {
              url: 'http://localhost:8000/media/202107/E/cee9ddef-ddf0-11eb-8038-002590aaee66_E.jpg',
            },
            {
              url: 'http://localhost:8000/media/202107/E/cee96116-ddf0-11eb-8038-002590aaee66_E.jpg',
            },
            {
              url: 'http://localhost:8000/media/202107/E/9370239c-de7a-11eb-8058-002590aaee66_E.jpg',
            },
            {
              url: 'http://localhost:8000/media/202107/E/cee73e0e-ddf0-11eb-8038-002590aaee66_E.jpg',
            },
            {
              url: 'http://localhost:8000/media/202107/E/9538eac4-de7a-11eb-8058-002590aaee66_E.jpg',
            },
            {
              url: 'http://localhost:8000/media/202107/E/9686b60e-de7a-11eb-8058-002590aaee66_E.jpg',
            },
            {
              url: 'http://localhost:8000/media/202107/E/97943bd6-de7a-11eb-8058-002590aaee66_E.jpg',
            },
            {
              url: 'http://localhost:8000/media/ColorSwatch/202107/ccf2d3a6-ddf0-11eb-8038-002590aaee66.jpg',
            },
          ],
        },
        productVariants: [
          {
            quantity: 2,
            productVariant: {
              id: 'UHJvZHVjdFZhcmlhbnQ6MTA3NzE1',
              name: '2PC-BLU-L-16813699702',
              sku: '2PC-BLU-L-16813699702',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'BLUE' }],
                },
                {
                  attribute: { name: 'Commission' },
                  values: [{ name: '10' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: 'L' }],
                },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '9.5' }],
                },
                { attribute: { name: 'sku' }, values: [] },
                {
                  attribute: { name: 'Resale Price' },
                  values: [{ name: '15.2' }],
                },
              ],
              product: {
                category: {
                  id: 'Q2F0ZWdvcnk6NDY=',
                  name: 'BODYSUIT',
                  ancestors: {
                    edges: [
                      {
                        node: { id: 'Q2F0ZWdvcnk6Mg==', name: 'Women' },
                      },
                      {
                        node: { id: 'Q2F0ZWdvcnk6MTE=', name: 'TOPS' },
                      },
                    ],
                  },
                },
              },
              pricing: {
                price: { net: { amount: 9.5, currency: 'USD' } },
                onSale: false,
                discount: null,
              },
            },
          },
          {
            quantity: 2,
            productVariant: {
              id: 'UHJvZHVjdFZhcmlhbnQ6MTA3NzEz',
              name: '2PC-BLU-M-16813699701',
              sku: '2PC-BLU-M-16813699701',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'BLUE' }],
                },
                {
                  attribute: { name: 'Commission' },
                  values: [{ name: '10' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: 'M' }],
                },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '9.5' }],
                },
                { attribute: { name: 'sku' }, values: [] },
                {
                  attribute: { name: 'Resale Price' },
                  values: [{ name: '15.2' }],
                },
              ],
              product: {
                category: {
                  id: 'Q2F0ZWdvcnk6NDY=',
                  name: 'BODYSUIT',
                  ancestors: {
                    edges: [
                      {
                        node: { id: 'Q2F0ZWdvcnk6Mg==', name: 'Women' },
                      },
                      {
                        node: { id: 'Q2F0ZWdvcnk6MTE=', name: 'TOPS' },
                      },
                    ],
                  },
                },
              },
              pricing: {
                price: { net: { amount: 9.5, currency: 'USD' } },
                onSale: false,
                discount: null,
              },
            },
          },
          {
            quantity: 2,
            productVariant: {
              id: 'UHJvZHVjdFZhcmlhbnQ6MTA3NzEx',
              name: '2PC-BLU-S-16813699700',
              sku: '2PC-BLU-S-16813699700',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'BLUE' }],
                },
                {
                  attribute: { name: 'Commission' },
                  values: [{ name: '10' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: 'S' }],
                },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '9.5' }],
                },
                { attribute: { name: 'sku' }, values: [] },
                {
                  attribute: { name: 'Resale Price' },
                  values: [{ name: '15.2' }],
                },
              ],
              product: {
                category: {
                  id: 'Q2F0ZWdvcnk6NDY=',
                  name: 'BODYSUIT',
                  ancestors: {
                    edges: [
                      {
                        node: { id: 'Q2F0ZWdvcnk6Mg==', name: 'Women' },
                      },
                      {
                        node: { id: 'Q2F0ZWdvcnk6MTE=', name: 'TOPS' },
                      },
                    ],
                  },
                },
              },
              pricing: {
                price: { net: { amount: 9.5, currency: 'USD' } },
                onSale: false,
                discount: null,
              },
            },
          },
        ],
        shop: {
          id: '327',
          name: 'Apple Hips',
          madeIn: '',
          shippingMethods: [
            {
              id: '6d2ce54c-df7b-40eb-ab29-aab32e5fd1f8',
              shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6Mjk=',
              shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjI5',
            },
            {
              id: '80fcc326-7e2e-4887-9e87-643fc1a54160',
              shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6MzE=',
              shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjMx',
            },
            {
              id: '48bfde7b-60e0-422c-aa35-2f8b1619b832',
              shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6Mzg=',
              shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjM4',
            },
            {
              id: 'c94abb29-cf64-4765-8fef-23a09de49003',
              shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6Mzk=',
              shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjM5',
            },
            {
              id: '7df5ab0b-c757-493e-bab5-83cd09ec8677',
              shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6NDA=',
              shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjQw',
            },
          ],
        },
      },
    },
  ],
  selectedMethods: [],
};

export const mockOrderData = {
  id: 'T3JkZXI6MjFiMTY4ZmMtYWZlOS00NWIxLWFlMzItMTkxOTBjNjU2ZDcw',
  number: '565',
  deliveryMethod: { id: 'U2hpcHBpbmdNZXRob2Q6NzA=', name: 'UPS Ground' },
  lines: [
    {
      id: 'T3JkZXJMaW5lOmVkMTdmNDhkLWM2MDQtNDlmZS1iMGU5LTliN2MwZmJjZWMzOA==',
      variant: { id: 'UHJvZHVjdFZhcmlhbnQ6MTA3NzE1' },
    },
    {
      id: 'T3JkZXJMaW5lOjVhYzMxZjE1LWEzYjgtNDMyYi04OGViLTc3ZjI1ZGQ0NTlkMQ==',
      variant: { id: 'UHJvZHVjdFZhcmlhbnQ6MTA3NzEz' },
    },
    {
      id: 'T3JkZXJMaW5lOmQ1ZjU4NTk5LTViN2MtNDlkZC1iNjQ1LTViYzI2ZTA2NGQ1ZA==',
      variant: { id: 'UHJvZHVjdFZhcmlhbnQ6MTA3NzEx' },
    },
  ],
  shippingAddress: {
    firstName: 'Ali',
    lastName: 'Afzal',
    streetAddress1: 'Chula Vista',
    streetAddress2: '',
    phone: '+12025550104',
    companyName: 'AIworks',
    city: 'LOS ANGELES',
    postalCode: '91105',
    countryArea: 'CA',
    country: { code: 'US', country: 'United States of America' },
    isDefaultShippingAddress: null,
  },
  billingAddress: {
    firstName: 'Ali',
    lastName: 'Afzal',
    streetAddress1: 'Chula Vista',
    streetAddress2: '',
    phone: '+12025550104',
    companyName: 'AIworks',
    city: 'LOS ANGELES',
    postalCode: '91105',
    countryArea: 'CA',
    country: { code: 'US', country: 'United States of America' },
    isDefaultShippingAddress: null,
  },
};

export const expectedOrdersByShop = [
  {
    shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6NzA=',
    shopId: '327',
    orderId: 'T3JkZXI6MjFiMTY4ZmMtYWZlOS00NWIxLWFlMzItMTkxOTBjNjU2ZDcw',
    marketplaceOrderBundles: [
      {
        bundleId: '19c88ba8-7429-45f7-87dd-a9999803d955',
        quantity: 5,
        orderlineIds: [
          'T3JkZXJMaW5lOmVkMTdmNDhkLWM2MDQtNDlmZS1iMGU5LTliN2MwZmJjZWMzOA==',
          'T3JkZXJMaW5lOjVhYzMxZjE1LWEzYjgtNDMyYi04OGViLTc3ZjI1ZGQ0NTlkMQ==',
          'T3JkZXJMaW5lOmQ1ZjU4NTk5LTViN2MtNDlkZC1iNjQ1LTViYzI2ZTA2NGQ1ZA==',
        ],
      },
    ],
  },
];
