export const newOpenPackCreateMocks = {
  input: {
    userEmail: 'azhariqbal100@mailinator.com',
    checkoutId: 'Q2hlY2tvdXQ6N2Q5MmJiZWEtY2Y3OC00OTk2LTg1OTctMzRlZGJjYmM2NjQ1',
    bundles: [
      {
        isOpenBundle: true,
        shopId: '392',
        productId: 'UHJvZHVjdDoyMzc4NA==',
        description: 'string',
        name: 'string',
        productVariants: [
          {
            productVariantId: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzYz',
            quantity: 0,
          },
          {
            productVariantId: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzY0',
            quantity: 0,
          },
          {
            productVariantId: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzY1',
            quantity: 0,
          },
          {
            productVariantId: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzY2',
            quantity: 9,
          },
        ],
      },
    ],
  },
  marketplaceCheckout: {
    __typename: 'CheckoutBundlesType',
    userEmail: 'azhariqbal100@mailinator.com',
    totalAmount: 763.2,
    subTotal: 763.2,
    taxes: 0,
    discounts: 0,
    checkoutId: 'Q2hlY2tvdXQ6N2Q5MmJiZWEtY2Y3OC00OTk2LTg1OTctMzRlZGJjYmM2NjQ1',
    checkoutBundles: [
      {
        checkoutBundleId: 'a3fed88b-589e-4c67-b5dd-cfa39c323093',
        isSelected: true,
        quantity: 1,
        price: 763.2,
        bundle: {
          id: 'be498117-308c-484f-a604-dcdf6ff99c34',
          name: 'Off Shoulder Bell Sleeve Romper',
          isOpenBundle: true,
          description:
            '{"time": 1686644602112, "blocks": [{"id": "cqWmV3MIPH", "data": {"text": "Material: the material is soft and comfy.\\r\\nFeatures: Off Shoulder, 1/2 Sleeve, Bell Sleeve, Ruffle, Solid, Wide Leg, Elastic Waist, Loose Fit, Casual.\\r\\nOccasion: Casual/Daily/Outdoor/Vacation/Holiday/School/Going Out.\\r\\nMADE IN CHINA"}, "type": "paragraph"}], "version": "2.24.3"}',
          slug: 'off-shoulder-bell-sleeve-romper',
          price: 763.2,
          product: {
            id: 'UHJvZHVjdDoyMzc4NA==',
            description:
              '{"time": 1686644602112, "blocks": [{"id": "cqWmV3MIPH", "data": {"text": "Material: the material is soft and comfy.\\r\\nFeatures: Off Shoulder, 1/2 Sleeve, Bell Sleeve, Ruffle, Solid, Wide Leg, Elastic Waist, Loose Fit, Casual.\\r\\nOccasion: Casual/Daily/Outdoor/Vacation/Holiday/School/Going Out.\\r\\nMADE IN CHINA"}, "type": "paragraph"}], "version": "2.24.3"}',
            name: 'Off Shoulder Bell Sleeve Romper',
            slug: 'off-shoulder-bell-sleeve-romper-2',
            metadata: [
              { key: 'isOpenPack', value: 'true' },
              { key: 'openPackMinimumQuantity', value: '1' },
              { key: 'vendorId', value: '392' },
              { key: 'vendorName', value: 'K Z GLOBAL TRADING' },
            ],
            thumbnail: {
              url: 'http://localhost:8000/media/202112/V/508dda0e-5488-11ec-b951-027098eb172b_V.jpg',
            },
            media: [
              {
                url: 'http://localhost:8000/media/202112/E/508dda0e-5488-11ec-b951-027098eb172b_E.jpg',
              },
              {
                url: 'http://localhost:8000/media/202112/E/508dda0f-5488-11ec-b951-027098eb172b_E.jpg',
              },
              {
                url: 'http://localhost:8000/media/202112/E/52161c60-5488-11ec-b951-027098eb172b_E.jpg',
              },
              {
                url: 'http://localhost:8000/media/202112/E/5522d57e-5488-11ec-b951-027098eb172b_E.jpg',
              },
              {
                url: 'http://localhost:8000/media/202112/E/56152900-5488-11ec-b951-027098eb172b_E.jpg',
              },
              {
                url: 'http://localhost:8000/media/202112/E/56b47b18-5488-11ec-b951-027098eb172b_E.jpg',
              },
            ],
          },
          productVariants: [
            {
              quantity: 36,
              productVariant: {
                id: 'UHJvZHVjdFZhcmlhbnQ6MTY5Mzcw',
                sku: '93706637-AMM_0123-4-7',
                attributes: [
                  {
                    attribute: { name: 'Color' },
                    values: [{ name: 'MINT' }],
                  },
                  {
                    attribute: { name: 'Commission' },
                    values: [{ name: '10' }],
                  },
                  {
                    attribute: { name: 'Size' },
                    values: [{ name: 'XL' }],
                  },
                  {
                    attribute: { name: 'Cost Price' },
                    values: [{ name: '15.9' }],
                  },
                  { attribute: { name: 'sku' }, values: [] },
                  {
                    attribute: { name: 'Resale Price' },
                    values: [{ name: '25.44' }],
                  },
                ],
                media: [],
                pricing: {
                  price: { net: { amount: 15.9, currency: 'USD' } },
                  onSale: false,
                  discount: null,
                },
              },
            },
            {
              quantity: 0,
              productVariant: {
                id: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzY5',
                sku: '93706637-AMM_0123-4-6',
                attributes: [
                  {
                    attribute: { name: 'Color' },
                    values: [{ name: 'MINT' }],
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
                    values: [{ name: '15.9' }],
                  },
                  { attribute: { name: 'sku' }, values: [] },
                  {
                    attribute: { name: 'Resale Price' },
                    values: [{ name: '25.44' }],
                  },
                ],
                media: [],
                pricing: {
                  price: { net: { amount: 15.9, currency: 'USD' } },
                  onSale: false,
                  discount: null,
                },
              },
            },
            {
              quantity: 0,
              productVariant: {
                id: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzY4',
                sku: '93706637-AMM_0123-4-5',
                attributes: [
                  {
                    attribute: { name: 'Color' },
                    values: [{ name: 'MINT' }],
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
                    values: [{ name: '15.9' }],
                  },
                  { attribute: { name: 'sku' }, values: [] },
                  {
                    attribute: { name: 'Resale Price' },
                    values: [{ name: '25.44' }],
                  },
                ],
                media: [],
                pricing: {
                  price: { net: { amount: 15.9, currency: 'USD' } },
                  onSale: false,
                  discount: null,
                },
              },
            },
            {
              quantity: 12,
              productVariant: {
                id: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzY3',
                sku: '93706637-AMM_0123-4-4',
                attributes: [
                  {
                    attribute: { name: 'Color' },
                    values: [{ name: 'MINT' }],
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
                    values: [{ name: '15.9' }],
                  },
                  { attribute: { name: 'sku' }, values: [] },
                  {
                    attribute: { name: 'Resale Price' },
                    values: [{ name: '25.44' }],
                  },
                ],
                media: [],
                pricing: {
                  price: { net: { amount: 15.9, currency: 'USD' } },
                  onSale: false,
                  discount: null,
                },
              },
            },
          ],
          shop: {
            id: '392',
            name: 'K Z GLOBAL TRADING',
            madeIn: 'CHINA',
            minOrder: 100,
            shippingMethods: [
              {
                id: '01d6e5e0-3998-4600-badf-4e83454e6f71',
                shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6NTk=',
                shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjU5',
              },
              {
                id: '2734842d-49f6-4c8c-adbb-e6574a513415',
                shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6NDA=',
                shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjQw',
              },
              {
                id: '31743aa2-d526-4c80-bde7-3bccc74697f9',
                shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6Mzk=',
                shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjM5',
              },
              {
                id: 'e6d1600c-b7cb-498a-82fb-cfc99a76d003',
                shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6Mzg=',
                shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjM4',
              },
              {
                id: 'de3479ae-d9bc-4c78-9101-8c63a469bc38',
                shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6MzY=',
                shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjM2',
              },
              {
                id: 'a6d9ed25-47c4-4bef-b643-592605a6011a',
                shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6MzE=',
                shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjMx',
              },
              {
                id: 'e403e956-5ee4-464b-b623-87c46c1aa979',
                shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6Mjk=',
                shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjI5',
              },
            ],
          },
        },
      },
    ],
    selectedMethods: [],
  },
  bundles: {
    status: 200,
    data: {
      edges: [
        {
          node: {
            id: 'c85cd591-c370-43b6-ab9b-71efaf5d0059',
            name: 'string',
            isOpenBundle: true,
            description: 'string',
            slug: 'string',
            price: 143.1,
            shop: {
              id: '392',
              name: 'K Z GLOBAL TRADING',
              email: 'FASHIONSTYLE0707@GMAIL.COM',
              url: 'www.orangeshine.com/kzglobaltrading',
              madeIn: 'CHINA',
              minOrder: 100,
              description:
                'K Z Global Trading a manufacturer and wholesaler of Missy Styles.We are leading online fashion clothing wholesaler. We located at the heart of Los Angeles.Our own branded clothing lines including dresses, tops, pants, swimsuits. Styles for Junior, Contemporary fashion apparel. Hundreds of new styles will be updated every month. We work on Monday - Friday 9:30 am - 5:00 pm PST. Excludes holidays.',
              about:
                'K Z Global Trading a manufacturer and wholesaler of Missy Styles.We are leading online fashion clothing wholesaler. We located at the heart of Los Angeles.Our own branded clothing lines including dresses, tops, pants, swimsuits. Styles for Junior, Contemporary fashion apparel. Hundreds of new styles will be updated every month. We work on Monday - Friday 9:30 am - 5:00 pm PST. Excludes holidays.',
              returnPolicy:
                "We have an estimated processing time of 2-3 business days. (not Guarantee). If the items have shipped, any cancellation request will not be available. if refuse the package, we won't refund shipping cost.     After the order was shipped, any address change is not allowed. We will overcharge $20, if we found customer change address after we shipped order.    We ship the items and sizes that are in stock unless instructed otherwise on the notes. If you would like to be notified with any sold outs please add a note on the order.    For clearance items, we may not have full pack, the quantity will be sold as it is. ALL CLEARANCE ITEMS ARE FINAL SALE, NO RETURNS OR EXCHANGES.    Exchange Policy: Any order damage must provided  the picture and let our customer service know in 30 days (the day after customer received the package). if not,  no credit and refund will be issued on items after that permitted time.",
              storePolicy:
                "We have an estimated processing time of 2-3 business days. (not Guarantee). If the items have shipped, any cancellation request will not be available. if refuse the package, we won't refund shipping cost.     After the order was shipped, any address change is not allowed. We will overcharge $20, if we found customer change address after we shipped order.    We ship the items and sizes that are in stock unless instructed otherwise on the notes. If you would like to be notified with any sold outs please add a note on the order.    For clearance items, we may not have full pack, the quantity will be sold as it is. ALL CLEARANCE ITEMS ARE FINAL SALE, NO RETURNS OR EXCHANGES.    Exchange Policy: Any order damage must provided  the picture and let our customer service know in 30 days (the day after customer received the package). if not,  no credit and refund will be issued on items after that permitted time.",
              shipsFrom: 'Ontario,CA',
              fields: [
                { name: 'phonenumber', values: ['+16264274549'] },
                {
                  name: 'vendormainimage',
                  values: [
                    'https://dc964uidi8qge.cloudfront.net/OSFile/OS/banners/vendor/Profile_K_Z_GLOBAL_TRADING.jpg',
                  ],
                },
                {
                  name: 'banner',
                  values: [
                    'https://dc964uidi8qge.cloudfront.net/OSFile/OS/banners/vendor/kz_global_logo_1.jpg',
                    'https://dc964uidi8qge.cloudfront.net/OSFile/OS/banners/vendor/kz_global_logo_2.jpg',
                    'https://dc964uidi8qge.cloudfront.net/OSFile/OS/banners/vendor/kz_global_logo_3.jpg',
                    'https://dc964uidi8qge.cloudfront.net/OSFile/OS/banners/vendor/kz_global_logo_4.jpg',
                    'https://dc964uidi8qge.cloudfront.net/OSFile/OS/banners/vendor/kz_global_logo_5.jpg',
                    'https://dc964uidi8qge.cloudfront.net/OSFile/OS/banners/vendor/KZGlobal_logo_6.jpg',
                    'https://dc964uidi8qge.cloudfront.net/OSFile/OS/banners/vendor/kz_global_logo_7.jpg',
                  ],
                },
              ],
            },
            productVariants: [
              {
                quantity: 9,
                attributes: [],
                productVariant: { id: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzY2' },
              },
              {
                quantity: 0,
                attributes: [],
                productVariant: { id: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzY1' },
              },
              {
                quantity: 0,
                attributes: [],
                productVariant: { id: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzY0' },
              },
              {
                quantity: 0,
                attributes: [],
                productVariant: { id: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzYz' },
              },
            ],
          },
        },
      ],
    },
  },
  addLines: {
    id: 'Q2hlY2tvdXQ6N2Q5MmJiZWEtY2Y3OC00OTk2LTg1OTctMzRlZGJjYmM2NjQ1',
    lines: [
      {
        id: 'Q2hlY2tvdXRMaW5lOjMyYTBiMzc3LTc4N2ItNGMyYS04M2NhLTFiNzcxOTVkYzMzYg==',
        quantity: 12,
        variant: { id: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzY3' },
      },
      {
        id: 'Q2hlY2tvdXRMaW5lOmUzMzdlN2IzLWQwNmItNDQ4Zi04NTE3LWM2NjA0NWJhYjAxYQ==',
        quantity: 36,
        variant: { id: 'UHJvZHVjdFZhcmlhbnQ6MTY5Mzcw' },
      },
      {
        id: 'Q2hlY2tvdXRMaW5lOmFiN2M1MmM4LTRmOGItNGIxMS1hNzY0LWQ3YWRmZTU0MTYwNA==',
        quantity: 9,
        variant: { id: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzY2' },
      },
    ],
  },
  marketplaceResult: {
    __typename: 'CheckoutBundlesType',
    userEmail: 'azhariqbal100@mailinator.com',
    totalAmount: 906.3,
    subTotal: 906.3,
    taxes: 0,
    discounts: 0,
    checkoutId: 'Q2hlY2tvdXQ6N2Q5MmJiZWEtY2Y3OC00OTk2LTg1OTctMzRlZGJjYmM2NjQ1',
    checkoutBundles: [
      {
        checkoutBundleId: '12fb69e3-61c9-4ce9-9b03-d7165cd0418c',
        isSelected: true,
        quantity: 1,
        price: 143.1,
        bundle: {
          id: 'c85cd591-c370-43b6-ab9b-71efaf5d0059',
          name: 'string',
          isOpenBundle: true,
          description: 'string',
          slug: 'string',
          price: 143.1,
          product: {
            id: 'UHJvZHVjdDoyMzc4NA==',
            description:
              '{"time": 1686644602112, "blocks": [{"id": "cqWmV3MIPH", "data": {"text": "Material: the material is soft and comfy.\\r\\nFeatures: Off Shoulder, 1/2 Sleeve, Bell Sleeve, Ruffle, Solid, Wide Leg, Elastic Waist, Loose Fit, Casual.\\r\\nOccasion: Casual/Daily/Outdoor/Vacation/Holiday/School/Going Out.\\r\\nMADE IN CHINA"}, "type": "paragraph"}], "version": "2.24.3"}',
            name: 'Off Shoulder Bell Sleeve Romper',
            slug: 'off-shoulder-bell-sleeve-romper-2',
            metadata: [
              { key: 'isOpenPack', value: 'true' },
              { key: 'openPackMinimumQuantity', value: '1' },
              { key: 'vendorId', value: '392' },
              { key: 'vendorName', value: 'K Z GLOBAL TRADING' },
            ],
            thumbnail: {
              url: 'http://localhost:8000/media/202112/V/508dda0e-5488-11ec-b951-027098eb172b_V.jpg',
            },
            media: [
              {
                url: 'http://localhost:8000/media/202112/E/508dda0e-5488-11ec-b951-027098eb172b_E.jpg',
              },
              {
                url: 'http://localhost:8000/media/202112/E/508dda0f-5488-11ec-b951-027098eb172b_E.jpg',
              },
              {
                url: 'http://localhost:8000/media/202112/E/52161c60-5488-11ec-b951-027098eb172b_E.jpg',
              },
              {
                url: 'http://localhost:8000/media/202112/E/5522d57e-5488-11ec-b951-027098eb172b_E.jpg',
              },
              {
                url: 'http://localhost:8000/media/202112/E/56152900-5488-11ec-b951-027098eb172b_E.jpg',
              },
              {
                url: 'http://localhost:8000/media/202112/E/56b47b18-5488-11ec-b951-027098eb172b_E.jpg',
              },
            ],
          },
          productVariants: [
            {
              quantity: 9,
              productVariant: {
                id: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzY2',
                sku: '93706637-AMM_0100-4-3',
                attributes: [
                  {
                    attribute: { name: 'Color' },
                    values: [{ name: 'BEIGE' }],
                  },
                  {
                    attribute: { name: 'Commission' },
                    values: [{ name: '10' }],
                  },
                  {
                    attribute: { name: 'Size' },
                    values: [{ name: 'XL' }],
                  },
                  {
                    attribute: { name: 'Cost Price' },
                    values: [{ name: '15.9' }],
                  },
                  { attribute: { name: 'sku' }, values: [] },
                  {
                    attribute: { name: 'Resale Price' },
                    values: [{ name: '25.44' }],
                  },
                ],
                media: [],
                pricing: {
                  price: { net: { amount: 15.9, currency: 'USD' } },
                  onSale: false,
                  discount: null,
                },
              },
            },
            {
              quantity: 0,
              productVariant: {
                id: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzY1',
                sku: '93706637-AMM_0100-4-2',
                attributes: [
                  {
                    attribute: { name: 'Color' },
                    values: [{ name: 'BEIGE' }],
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
                    values: [{ name: '15.9' }],
                  },
                  { attribute: { name: 'sku' }, values: [] },
                  {
                    attribute: { name: 'Resale Price' },
                    values: [{ name: '25.44' }],
                  },
                ],
                media: [],
                pricing: {
                  price: { net: { amount: 15.9, currency: 'USD' } },
                  onSale: false,
                  discount: null,
                },
              },
            },
            {
              quantity: 0,
              productVariant: {
                id: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzY0',
                sku: '93706637-AMM_0100-4-1',
                attributes: [
                  {
                    attribute: { name: 'Color' },
                    values: [{ name: 'BEIGE' }],
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
                    values: [{ name: '15.9' }],
                  },
                  { attribute: { name: 'sku' }, values: [] },
                  {
                    attribute: { name: 'Resale Price' },
                    values: [{ name: '25.44' }],
                  },
                ],
                media: [],
                pricing: {
                  price: { net: { amount: 15.9, currency: 'USD' } },
                  onSale: false,
                  discount: null,
                },
              },
            },
            {
              quantity: 0,
              productVariant: {
                id: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzYz',
                sku: '93706637-AMM_0100-4-0',
                attributes: [
                  {
                    attribute: { name: 'Color' },
                    values: [{ name: 'BEIGE' }],
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
                    values: [{ name: '15.9' }],
                  },
                  { attribute: { name: 'sku' }, values: [] },
                  {
                    attribute: { name: 'Resale Price' },
                    values: [{ name: '25.44' }],
                  },
                ],
                media: [],
                pricing: {
                  price: { net: { amount: 15.9, currency: 'USD' } },
                  onSale: false,
                  discount: null,
                },
              },
            },
          ],
          shop: {
            id: '392',
            name: 'K Z GLOBAL TRADING',
            madeIn: 'CHINA',
            minOrder: 100,
            shippingMethods: [
              {
                id: '01d6e5e0-3998-4600-badf-4e83454e6f71',
                shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6NTk=',
                shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjU5',
              },
              {
                id: '2734842d-49f6-4c8c-adbb-e6574a513415',
                shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6NDA=',
                shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjQw',
              },
              {
                id: '31743aa2-d526-4c80-bde7-3bccc74697f9',
                shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6Mzk=',
                shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjM5',
              },
              {
                id: 'e6d1600c-b7cb-498a-82fb-cfc99a76d003',
                shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6Mzg=',
                shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjM4',
              },
              {
                id: 'de3479ae-d9bc-4c78-9101-8c63a469bc38',
                shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6MzY=',
                shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjM2',
              },
              {
                id: 'a6d9ed25-47c4-4bef-b643-592605a6011a',
                shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6MzE=',
                shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjMx',
              },
              {
                id: 'e403e956-5ee4-464b-b623-87c46c1aa979',
                shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6Mjk=',
                shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjI5',
              },
            ],
          },
        },
      },
      {
        checkoutBundleId: 'a3fed88b-589e-4c67-b5dd-cfa39c323093',
        isSelected: true,
        quantity: 1,
        price: 763.2,
        bundle: {
          id: 'be498117-308c-484f-a604-dcdf6ff99c34',
          name: 'Off Shoulder Bell Sleeve Romper',
          isOpenBundle: true,
          description:
            '{"time": 1686644602112, "blocks": [{"id": "cqWmV3MIPH", "data": {"text": "Material: the material is soft and comfy.\\r\\nFeatures: Off Shoulder, 1/2 Sleeve, Bell Sleeve, Ruffle, Solid, Wide Leg, Elastic Waist, Loose Fit, Casual.\\r\\nOccasion: Casual/Daily/Outdoor/Vacation/Holiday/School/Going Out.\\r\\nMADE IN CHINA"}, "type": "paragraph"}], "version": "2.24.3"}',
          slug: 'off-shoulder-bell-sleeve-romper',
          price: 763.2,
          product: {
            id: 'UHJvZHVjdDoyMzc4NA==',
            description:
              '{"time": 1686644602112, "blocks": [{"id": "cqWmV3MIPH", "data": {"text": "Material: the material is soft and comfy.\\r\\nFeatures: Off Shoulder, 1/2 Sleeve, Bell Sleeve, Ruffle, Solid, Wide Leg, Elastic Waist, Loose Fit, Casual.\\r\\nOccasion: Casual/Daily/Outdoor/Vacation/Holiday/School/Going Out.\\r\\nMADE IN CHINA"}, "type": "paragraph"}], "version": "2.24.3"}',
            name: 'Off Shoulder Bell Sleeve Romper',
            slug: 'off-shoulder-bell-sleeve-romper-2',
            metadata: [
              { key: 'isOpenPack', value: 'true' },
              { key: 'openPackMinimumQuantity', value: '1' },
              { key: 'vendorId', value: '392' },
              { key: 'vendorName', value: 'K Z GLOBAL TRADING' },
            ],
            thumbnail: {
              url: 'http://localhost:8000/media/202112/V/508dda0e-5488-11ec-b951-027098eb172b_V.jpg',
            },
            media: [
              {
                url: 'http://localhost:8000/media/202112/E/508dda0e-5488-11ec-b951-027098eb172b_E.jpg',
              },
              {
                url: 'http://localhost:8000/media/202112/E/508dda0f-5488-11ec-b951-027098eb172b_E.jpg',
              },
              {
                url: 'http://localhost:8000/media/202112/E/52161c60-5488-11ec-b951-027098eb172b_E.jpg',
              },
              {
                url: 'http://localhost:8000/media/202112/E/5522d57e-5488-11ec-b951-027098eb172b_E.jpg',
              },
              {
                url: 'http://localhost:8000/media/202112/E/56152900-5488-11ec-b951-027098eb172b_E.jpg',
              },
              {
                url: 'http://localhost:8000/media/202112/E/56b47b18-5488-11ec-b951-027098eb172b_E.jpg',
              },
            ],
          },
          productVariants: [
            {
              quantity: 36,
              productVariant: {
                id: 'UHJvZHVjdFZhcmlhbnQ6MTY5Mzcw',
                sku: '93706637-AMM_0123-4-7',
                attributes: [
                  {
                    attribute: { name: 'Color' },
                    values: [{ name: 'MINT' }],
                  },
                  {
                    attribute: { name: 'Commission' },
                    values: [{ name: '10' }],
                  },
                  {
                    attribute: { name: 'Size' },
                    values: [{ name: 'XL' }],
                  },
                  {
                    attribute: { name: 'Cost Price' },
                    values: [{ name: '15.9' }],
                  },
                  { attribute: { name: 'sku' }, values: [] },
                  {
                    attribute: { name: 'Resale Price' },
                    values: [{ name: '25.44' }],
                  },
                ],
                media: [],
                pricing: {
                  price: { net: { amount: 15.9, currency: 'USD' } },
                  onSale: false,
                  discount: null,
                },
              },
            },
            {
              quantity: 0,
              productVariant: {
                id: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzY5',
                sku: '93706637-AMM_0123-4-6',
                attributes: [
                  {
                    attribute: { name: 'Color' },
                    values: [{ name: 'MINT' }],
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
                    values: [{ name: '15.9' }],
                  },
                  { attribute: { name: 'sku' }, values: [] },
                  {
                    attribute: { name: 'Resale Price' },
                    values: [{ name: '25.44' }],
                  },
                ],
                media: [],
                pricing: {
                  price: { net: { amount: 15.9, currency: 'USD' } },
                  onSale: false,
                  discount: null,
                },
              },
            },
            {
              quantity: 0,
              productVariant: {
                id: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzY4',
                sku: '93706637-AMM_0123-4-5',
                attributes: [
                  {
                    attribute: { name: 'Color' },
                    values: [{ name: 'MINT' }],
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
                    values: [{ name: '15.9' }],
                  },
                  { attribute: { name: 'sku' }, values: [] },
                  {
                    attribute: { name: 'Resale Price' },
                    values: [{ name: '25.44' }],
                  },
                ],
                media: [],
                pricing: {
                  price: { net: { amount: 15.9, currency: 'USD' } },
                  onSale: false,
                  discount: null,
                },
              },
            },
            {
              quantity: 12,
              productVariant: {
                id: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzY3',
                sku: '93706637-AMM_0123-4-4',
                attributes: [
                  {
                    attribute: { name: 'Color' },
                    values: [{ name: 'MINT' }],
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
                    values: [{ name: '15.9' }],
                  },
                  { attribute: { name: 'sku' }, values: [] },
                  {
                    attribute: { name: 'Resale Price' },
                    values: [{ name: '25.44' }],
                  },
                ],
                media: [],
                pricing: {
                  price: { net: { amount: 15.9, currency: 'USD' } },
                  onSale: false,
                  discount: null,
                },
              },
            },
          ],
          shop: {
            id: '392',
            name: 'K Z GLOBAL TRADING',
            madeIn: 'CHINA',
            minOrder: 100,
            shippingMethods: [
              {
                id: '01d6e5e0-3998-4600-badf-4e83454e6f71',
                shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6NTk=',
                shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjU5',
              },
              {
                id: '2734842d-49f6-4c8c-adbb-e6574a513415',
                shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6NDA=',
                shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjQw',
              },
              {
                id: '31743aa2-d526-4c80-bde7-3bccc74697f9',
                shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6Mzk=',
                shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjM5',
              },
              {
                id: 'e6d1600c-b7cb-498a-82fb-cfc99a76d003',
                shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6Mzg=',
                shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjM4',
              },
              {
                id: 'de3479ae-d9bc-4c78-9101-8c63a469bc38',
                shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6MzY=',
                shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjM2',
              },
              {
                id: 'a6d9ed25-47c4-4bef-b643-592605a6011a',
                shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6MzE=',
                shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjMx',
              },
              {
                id: 'e403e956-5ee4-464b-b623-87c46c1aa979',
                shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6Mjk=',
                shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjI5',
              },
            ],
          },
        },
      },
    ],
    selectedMethods: [],
  },
  createBundle: {
    id: 'c85cd591-c370-43b6-ab9b-71efaf5d0059',
    name: 'string',
    isOpenBundle: true,
    description: 'string',
    slug: 'string',
    price: 143.1,
  },
  expectedResult: {
    status: 201,
    data: {
      saleor: {
        id: 'Q2hlY2tvdXQ6N2Q5MmJiZWEtY2Y3OC00OTk2LTg1OTctMzRlZGJjYmM2NjQ1',
        lines: [
          {
            id: 'Q2hlY2tvdXRMaW5lOjMyYTBiMzc3LTc4N2ItNGMyYS04M2NhLTFiNzcxOTVkYzMzYg==',
            quantity: 12,
            variant: { id: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzY3' },
          },
          {
            id: 'Q2hlY2tvdXRMaW5lOmUzMzdlN2IzLWQwNmItNDQ4Zi04NTE3LWM2NjA0NWJhYjAxYQ==',
            quantity: 36,
            variant: { id: 'UHJvZHVjdFZhcmlhbnQ6MTY5Mzcw' },
          },
          {
            id: 'Q2hlY2tvdXRMaW5lOmFiN2M1MmM4LTRmOGItNGIxMS1hNzY0LWQ3YWRmZTU0MTYwNA==',
            quantity: 9,
            variant: { id: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzY2' },
          },
        ],
      },
      marketplace: {
        __typename: 'CheckoutBundlesType',
        userEmail: 'azhariqbal100@mailinator.com',
        totalAmount: 906.3,
        subTotal: 906.3,
        taxes: 0,
        discounts: 0,
        checkoutId:
          'Q2hlY2tvdXQ6N2Q5MmJiZWEtY2Y3OC00OTk2LTg1OTctMzRlZGJjYmM2NjQ1',
        checkoutBundles: [
          {
            checkoutBundleId: '12fb69e3-61c9-4ce9-9b03-d7165cd0418c',
            isSelected: true,
            quantity: 1,
            price: 143.1,
            bundle: {
              id: 'c85cd591-c370-43b6-ab9b-71efaf5d0059',
              name: 'string',
              isOpenBundle: true,
              description: 'string',
              slug: 'string',
              price: 143.1,
              product: {
                id: 'UHJvZHVjdDoyMzc4NA==',
                description:
                  '{"time": 1686644602112, "blocks": [{"id": "cqWmV3MIPH", "data": {"text": "Material: the material is soft and comfy.\\r\\nFeatures: Off Shoulder, 1/2 Sleeve, Bell Sleeve, Ruffle, Solid, Wide Leg, Elastic Waist, Loose Fit, Casual.\\r\\nOccasion: Casual/Daily/Outdoor/Vacation/Holiday/School/Going Out.\\r\\nMADE IN CHINA"}, "type": "paragraph"}], "version": "2.24.3"}',
                name: 'Off Shoulder Bell Sleeve Romper',
                slug: 'off-shoulder-bell-sleeve-romper-2',
                metadata: [
                  { key: 'isOpenPack', value: 'true' },
                  { key: 'openPackMinimumQuantity', value: '1' },
                  { key: 'vendorId', value: '392' },
                  { key: 'vendorName', value: 'K Z GLOBAL TRADING' },
                ],
                thumbnail: {
                  url: 'http://localhost:8000/media/202112/V/508dda0e-5488-11ec-b951-027098eb172b_V.jpg',
                },
                media: [
                  {
                    url: 'http://localhost:8000/media/202112/E/508dda0e-5488-11ec-b951-027098eb172b_E.jpg',
                  },
                  {
                    url: 'http://localhost:8000/media/202112/E/508dda0f-5488-11ec-b951-027098eb172b_E.jpg',
                  },
                  {
                    url: 'http://localhost:8000/media/202112/E/52161c60-5488-11ec-b951-027098eb172b_E.jpg',
                  },
                  {
                    url: 'http://localhost:8000/media/202112/E/5522d57e-5488-11ec-b951-027098eb172b_E.jpg',
                  },
                  {
                    url: 'http://localhost:8000/media/202112/E/56152900-5488-11ec-b951-027098eb172b_E.jpg',
                  },
                  {
                    url: 'http://localhost:8000/media/202112/E/56b47b18-5488-11ec-b951-027098eb172b_E.jpg',
                  },
                ],
              },
              productVariants: [
                {
                  quantity: 9,
                  productVariant: {
                    id: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzY2',
                    sku: '93706637-AMM_0100-4-3',
                    attributes: [
                      {
                        attribute: { name: 'Color' },
                        values: [{ name: 'BEIGE' }],
                      },
                      {
                        attribute: { name: 'Commission' },
                        values: [{ name: '10' }],
                      },
                      {
                        attribute: { name: 'Size' },
                        values: [{ name: 'XL' }],
                      },
                      {
                        attribute: { name: 'Cost Price' },
                        values: [{ name: '15.9' }],
                      },
                      { attribute: { name: 'sku' }, values: [] },
                      {
                        attribute: { name: 'Resale Price' },
                        values: [{ name: '25.44' }],
                      },
                    ],
                    media: [],
                    pricing: {
                      price: { net: { amount: 15.9, currency: 'USD' } },
                      onSale: false,
                      discount: null,
                    },
                  },
                },
                {
                  quantity: 0,
                  productVariant: {
                    id: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzY1',
                    sku: '93706637-AMM_0100-4-2',
                    attributes: [
                      {
                        attribute: { name: 'Color' },
                        values: [{ name: 'BEIGE' }],
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
                        values: [{ name: '15.9' }],
                      },
                      { attribute: { name: 'sku' }, values: [] },
                      {
                        attribute: { name: 'Resale Price' },
                        values: [{ name: '25.44' }],
                      },
                    ],
                    media: [],
                    pricing: {
                      price: { net: { amount: 15.9, currency: 'USD' } },
                      onSale: false,
                      discount: null,
                    },
                  },
                },
                {
                  quantity: 0,
                  productVariant: {
                    id: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzY0',
                    sku: '93706637-AMM_0100-4-1',
                    attributes: [
                      {
                        attribute: { name: 'Color' },
                        values: [{ name: 'BEIGE' }],
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
                        values: [{ name: '15.9' }],
                      },
                      { attribute: { name: 'sku' }, values: [] },
                      {
                        attribute: { name: 'Resale Price' },
                        values: [{ name: '25.44' }],
                      },
                    ],
                    media: [],
                    pricing: {
                      price: { net: { amount: 15.9, currency: 'USD' } },
                      onSale: false,
                      discount: null,
                    },
                  },
                },
                {
                  quantity: 0,
                  productVariant: {
                    id: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzYz',
                    sku: '93706637-AMM_0100-4-0',
                    attributes: [
                      {
                        attribute: { name: 'Color' },
                        values: [{ name: 'BEIGE' }],
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
                        values: [{ name: '15.9' }],
                      },
                      { attribute: { name: 'sku' }, values: [] },
                      {
                        attribute: { name: 'Resale Price' },
                        values: [{ name: '25.44' }],
                      },
                    ],
                    media: [],
                    pricing: {
                      price: { net: { amount: 15.9, currency: 'USD' } },
                      onSale: false,
                      discount: null,
                    },
                  },
                },
              ],
              shop: {
                id: '392',
                name: 'K Z GLOBAL TRADING',
                madeIn: 'CHINA',
                minOrder: 100,
                shippingMethods: [
                  {
                    id: '01d6e5e0-3998-4600-badf-4e83454e6f71',
                    shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6NTk=',
                    shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjU5',
                  },
                  {
                    id: '2734842d-49f6-4c8c-adbb-e6574a513415',
                    shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6NDA=',
                    shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjQw',
                  },
                  {
                    id: '31743aa2-d526-4c80-bde7-3bccc74697f9',
                    shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6Mzk=',
                    shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjM5',
                  },
                  {
                    id: 'e6d1600c-b7cb-498a-82fb-cfc99a76d003',
                    shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6Mzg=',
                    shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjM4',
                  },
                  {
                    id: 'de3479ae-d9bc-4c78-9101-8c63a469bc38',
                    shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6MzY=',
                    shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjM2',
                  },
                  {
                    id: 'a6d9ed25-47c4-4bef-b643-592605a6011a',
                    shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6MzE=',
                    shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjMx',
                  },
                  {
                    id: 'e403e956-5ee4-464b-b623-87c46c1aa979',
                    shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6Mjk=',
                    shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjI5',
                  },
                ],
              },
            },
          },
          {
            checkoutBundleId: 'a3fed88b-589e-4c67-b5dd-cfa39c323093',
            isSelected: true,
            quantity: 1,
            price: 763.2,
            bundle: {
              id: 'be498117-308c-484f-a604-dcdf6ff99c34',
              name: 'Off Shoulder Bell Sleeve Romper',
              isOpenBundle: true,
              description:
                '{"time": 1686644602112, "blocks": [{"id": "cqWmV3MIPH", "data": {"text": "Material: the material is soft and comfy.\\r\\nFeatures: Off Shoulder, 1/2 Sleeve, Bell Sleeve, Ruffle, Solid, Wide Leg, Elastic Waist, Loose Fit, Casual.\\r\\nOccasion: Casual/Daily/Outdoor/Vacation/Holiday/School/Going Out.\\r\\nMADE IN CHINA"}, "type": "paragraph"}], "version": "2.24.3"}',
              slug: 'off-shoulder-bell-sleeve-romper',
              price: 763.2,
              product: {
                id: 'UHJvZHVjdDoyMzc4NA==',
                description:
                  '{"time": 1686644602112, "blocks": [{"id": "cqWmV3MIPH", "data": {"text": "Material: the material is soft and comfy.\\r\\nFeatures: Off Shoulder, 1/2 Sleeve, Bell Sleeve, Ruffle, Solid, Wide Leg, Elastic Waist, Loose Fit, Casual.\\r\\nOccasion: Casual/Daily/Outdoor/Vacation/Holiday/School/Going Out.\\r\\nMADE IN CHINA"}, "type": "paragraph"}], "version": "2.24.3"}',
                name: 'Off Shoulder Bell Sleeve Romper',
                slug: 'off-shoulder-bell-sleeve-romper-2',
                metadata: [
                  { key: 'isOpenPack', value: 'true' },
                  { key: 'openPackMinimumQuantity', value: '1' },
                  { key: 'vendorId', value: '392' },
                  { key: 'vendorName', value: 'K Z GLOBAL TRADING' },
                ],
                thumbnail: {
                  url: 'http://localhost:8000/media/202112/V/508dda0e-5488-11ec-b951-027098eb172b_V.jpg',
                },
                media: [
                  {
                    url: 'http://localhost:8000/media/202112/E/508dda0e-5488-11ec-b951-027098eb172b_E.jpg',
                  },
                  {
                    url: 'http://localhost:8000/media/202112/E/508dda0f-5488-11ec-b951-027098eb172b_E.jpg',
                  },
                  {
                    url: 'http://localhost:8000/media/202112/E/52161c60-5488-11ec-b951-027098eb172b_E.jpg',
                  },
                  {
                    url: 'http://localhost:8000/media/202112/E/5522d57e-5488-11ec-b951-027098eb172b_E.jpg',
                  },
                  {
                    url: 'http://localhost:8000/media/202112/E/56152900-5488-11ec-b951-027098eb172b_E.jpg',
                  },
                  {
                    url: 'http://localhost:8000/media/202112/E/56b47b18-5488-11ec-b951-027098eb172b_E.jpg',
                  },
                ],
              },
              productVariants: [
                {
                  quantity: 36,
                  productVariant: {
                    id: 'UHJvZHVjdFZhcmlhbnQ6MTY5Mzcw',
                    sku: '93706637-AMM_0123-4-7',
                    attributes: [
                      {
                        attribute: { name: 'Color' },
                        values: [{ name: 'MINT' }],
                      },
                      {
                        attribute: { name: 'Commission' },
                        values: [{ name: '10' }],
                      },
                      {
                        attribute: { name: 'Size' },
                        values: [{ name: 'XL' }],
                      },
                      {
                        attribute: { name: 'Cost Price' },
                        values: [{ name: '15.9' }],
                      },
                      { attribute: { name: 'sku' }, values: [] },
                      {
                        attribute: { name: 'Resale Price' },
                        values: [{ name: '25.44' }],
                      },
                    ],
                    media: [],
                    pricing: {
                      price: { net: { amount: 15.9, currency: 'USD' } },
                      onSale: false,
                      discount: null,
                    },
                  },
                },
                {
                  quantity: 0,
                  productVariant: {
                    id: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzY5',
                    sku: '93706637-AMM_0123-4-6',
                    attributes: [
                      {
                        attribute: { name: 'Color' },
                        values: [{ name: 'MINT' }],
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
                        values: [{ name: '15.9' }],
                      },
                      { attribute: { name: 'sku' }, values: [] },
                      {
                        attribute: { name: 'Resale Price' },
                        values: [{ name: '25.44' }],
                      },
                    ],
                    media: [],
                    pricing: {
                      price: { net: { amount: 15.9, currency: 'USD' } },
                      onSale: false,
                      discount: null,
                    },
                  },
                },
                {
                  quantity: 0,
                  productVariant: {
                    id: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzY4',
                    sku: '93706637-AMM_0123-4-5',
                    attributes: [
                      {
                        attribute: { name: 'Color' },
                        values: [{ name: 'MINT' }],
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
                        values: [{ name: '15.9' }],
                      },
                      { attribute: { name: 'sku' }, values: [] },
                      {
                        attribute: { name: 'Resale Price' },
                        values: [{ name: '25.44' }],
                      },
                    ],
                    media: [],
                    pricing: {
                      price: { net: { amount: 15.9, currency: 'USD' } },
                      onSale: false,
                      discount: null,
                    },
                  },
                },
                {
                  quantity: 12,
                  productVariant: {
                    id: 'UHJvZHVjdFZhcmlhbnQ6MTY5MzY3',
                    sku: '93706637-AMM_0123-4-4',
                    attributes: [
                      {
                        attribute: { name: 'Color' },
                        values: [{ name: 'MINT' }],
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
                        values: [{ name: '15.9' }],
                      },
                      { attribute: { name: 'sku' }, values: [] },
                      {
                        attribute: { name: 'Resale Price' },
                        values: [{ name: '25.44' }],
                      },
                    ],
                    media: [],
                    pricing: {
                      price: { net: { amount: 15.9, currency: 'USD' } },
                      onSale: false,
                      discount: null,
                    },
                  },
                },
              ],
              shop: {
                id: '392',
                name: 'K Z GLOBAL TRADING',
                madeIn: 'CHINA',
                minOrder: 100,
                shippingMethods: [
                  {
                    id: '01d6e5e0-3998-4600-badf-4e83454e6f71',
                    shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6NTk=',
                    shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjU5',
                  },
                  {
                    id: '2734842d-49f6-4c8c-adbb-e6574a513415',
                    shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6NDA=',
                    shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjQw',
                  },
                  {
                    id: '31743aa2-d526-4c80-bde7-3bccc74697f9',
                    shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6Mzk=',
                    shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjM5',
                  },
                  {
                    id: 'e6d1600c-b7cb-498a-82fb-cfc99a76d003',
                    shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6Mzg=',
                    shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjM4',
                  },
                  {
                    id: 'de3479ae-d9bc-4c78-9101-8c63a469bc38',
                    shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6MzY=',
                    shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjM2',
                  },
                  {
                    id: 'a6d9ed25-47c4-4bef-b643-592605a6011a',
                    shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6MzE=',
                    shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjMx',
                  },
                  {
                    id: 'e403e956-5ee4-464b-b623-87c46c1aa979',
                    shippingMethodId: 'U2hpcHBpbmdNZXRob2Q6Mjk=',
                    shippingMethodTypeId: 'U2hpcHBpbmdNZXRob2RUeXBlOjI5',
                  },
                ],
              },
            },
          },
        ],
        selectedMethods: [],
      },
    },
    message: 'bundles added to cart',
  },
};
