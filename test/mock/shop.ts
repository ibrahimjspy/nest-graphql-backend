export const shopIntegrationMocks = {
  expectedMyProductsResponse: {
    status: 200,
    data: [
      {
        id: '1031',
        name: 'Wakefa Soomb',
        email: 'wakefa4212@soombo.com',
        url: 'https://wakefaj6la6.com',
        madeIn: '',
        minOrder: 0,
        description: '',
        about: '',
        returnPolicy: '',
        storePolicy: '',
        fields: [
          { name: 'logo', values: [''] },
          { name: 'banner', values: [''] },
          { name: 'facebook', values: [''] },
          { name: 'pinterest', values: [''] },
          { name: 'instagram', values: [''] },
          { name: 'twitter', values: [''] },
          { name: 'storefrontids', values: ['169'] },
          {
            name: 'storefronturls',
            values: ['wakefasoomb.sharove.co'],
          },
          { name: 'myvendors', values: ['610'] },
        ],
      },
      {
        totalCount: 111,
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
          endCursor: 'WyJVSEp2WkhWamREb3hNVGt6TlRNPSJd',
          startCursor: 'WyJVSEp2WkhWamREb3hNVGt6TlRNPSJd',
        },
        edges: [
          {
            node: {
              id: 'UHJvZHVjdDoxMTkzNTM=',
              description: `{"time": 1662995227870, "blocks": [{"id": "cqWmV3MIPH", "data": {"text": "Men's Straight Fit Jeans  Denim Fabric  5 Pockets 98% Cotton & 2% Spandex  Sizes: 30-42 Open Stock  Available in 30 & 32 Length Only Imported  Model is 6'2 Wearing size 32/32"}, "type": "paragraph"}], "version": "2.24.3"}`,
              name: 'MENS STRAIGHT FIT JEANS',
              slug: 'mens-straight-fit-jeanss0ghe',
              thumbnail: {
                url: 'http://localhost:8000/media/202206/V/d9de39ac-f654-11ec-9274-0626c5bd3ecf_V.jpg',
              },
              metadata: [
                { key: 'vendorId', value: '318' },
                { key: 'vendorName', value: 'HAWKSBAY Collection' },
              ],
              category: {
                id: 'Q2F0ZWdvcnk6MjM2',
                name: 'BOTTOMS',
                ancestors: {
                  edges: [{ node: { id: 'Q2F0ZWdvcnk6MTg=', name: 'MEN' } }],
                },
              },
              media: [
                {
                  url: 'http://localhost:8000/media/202206/E/d9de39ac-f654-11ec-9274-0626c5bd3ecf_E.jpg',
                },
                {
                  url: 'http://localhost:8000/media/202206/E/d3cf09c4-f654-11ec-9273-0626c5bd3ecf_E.jpg',
                },
                {
                  url: 'http://localhost:8000/media/202206/E/d3d30b82-f654-11ec-9273-0626c5bd3ecf_E.jpg',
                },
                {
                  url: 'http://localhost:8000/media/202206/E/d9de386c-f654-11ec-9273-0626c5bd3ecf_E.jpg',
                },
                {
                  url: 'http://localhost:8000/media/202206/E/d9e27670-f654-11ec-9274-0626c5bd3ecf_E.jpg',
                },
                {
                  url: 'http://localhost:8000/media/202206/E/d9e721b6-f654-11ec-9274-0626c5bd3ecf_E.jpg',
                },
                {
                  url: 'http://localhost:8000/media/202206/E/d9e11c6c-f654-11ec-9274-0626c5bd3ecf_E.jpg',
                },
                {
                  url: 'http://localhost:8000/media/202206/E/e08989fa-f654-11ec-9274-0626c5bd3ecf_E.jpg',
                },
                {
                  url: 'http://localhost:8000/media/202206/E/e0912192-f654-11ec-9274-0626c5bd3ecf_E.jpg',
                },
                {
                  url: 'http://localhost:8000/media/ColorSwatch/202206/cf80641c-f654-11ec-9273-0626c5bd3ecf.jpg',
                },
                {
                  url: 'http://localhost:8000/media/ColorSwatch/202206/cbf9af38-f654-11ec-9273-0626c5bd3ecf.jpg',
                },
                {
                  url: 'http://localhost:8000/media/ColorSwatch/202206/c79c9770-f654-11ec-9273-0626c5bd3ecf.jpg',
                },
              ],
              variants: [
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDIx',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'BLACK' }],
                    },
                    { attribute: { name: 'Commission' }, values: [] },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '16.5' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: '30' }],
                    },
                    {
                      attribute: { name: 'sku' },
                      values: [{ name: 'MEN-BLA-30-16813717030' }],
                    },
                  ],
                  pricing: {
                    price: {
                      gross: { currency: 'USD', amount: 26.4 },
                      net: { currency: 'USD', amount: 26.4 },
                    },
                  },
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDIz',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'BLACK' }],
                    },
                    { attribute: { name: 'Commission' }, values: [] },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '16.5' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: '32' }],
                    },
                    {
                      attribute: { name: 'sku' },
                      values: [{ name: 'MEN-BLA-32-16813717031' }],
                    },
                  ],
                  pricing: {
                    price: {
                      gross: { currency: 'USD', amount: 26.4 },
                      net: { currency: 'USD', amount: 26.4 },
                    },
                  },
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDI1',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'BLACK' }],
                    },
                    { attribute: { name: 'Commission' }, values: [] },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '16.5' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: '34' }],
                    },
                    {
                      attribute: { name: 'sku' },
                      values: [{ name: 'MEN-BLA-34-16813717032' }],
                    },
                  ],
                  pricing: {
                    price: {
                      gross: { currency: 'USD', amount: 26.4 },
                      net: { currency: 'USD', amount: 26.4 },
                    },
                  },
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDI3',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'BLACK' }],
                    },
                    { attribute: { name: 'Commission' }, values: [] },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '16.5' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: '36' }],
                    },
                    {
                      attribute: { name: 'sku' },
                      values: [{ name: 'MEN-BLA-36-16813717033' }],
                    },
                  ],
                  pricing: {
                    price: {
                      gross: { currency: 'USD', amount: 26.4 },
                      net: { currency: 'USD', amount: 26.4 },
                    },
                  },
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDI5',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'BLACK' }],
                    },
                    { attribute: { name: 'Commission' }, values: [] },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '16.5' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: '38' }],
                    },
                    {
                      attribute: { name: 'sku' },
                      values: [{ name: 'MEN-BLA-38-16813717034' }],
                    },
                  ],
                  pricing: {
                    price: {
                      gross: { currency: 'USD', amount: 26.4 },
                      net: { currency: 'USD', amount: 26.4 },
                    },
                  },
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDMw',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'BLACK' }],
                    },
                    { attribute: { name: 'Commission' }, values: [] },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '16.5' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: '40' }],
                    },
                    {
                      attribute: { name: 'sku' },
                      values: [{ name: 'MEN-BLA-40-16813717035' }],
                    },
                  ],
                  pricing: {
                    price: {
                      gross: { currency: 'USD', amount: 26.4 },
                      net: { currency: 'USD', amount: 26.4 },
                    },
                  },
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDMx',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'BLACK' }],
                    },
                    { attribute: { name: 'Commission' }, values: [] },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '16.5' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: '42' }],
                    },
                    {
                      attribute: { name: 'sku' },
                      values: [{ name: 'MEN-BLA-42-16813717036' }],
                    },
                  ],
                  pricing: {
                    price: {
                      gross: { currency: 'USD', amount: 26.4 },
                      net: { currency: 'USD', amount: 26.4 },
                    },
                  },
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDMy',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'DARK BLUE' }],
                    },
                    { attribute: { name: 'Commission' }, values: [] },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '16.5' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: '30' }],
                    },
                    {
                      attribute: { name: 'sku' },
                      values: [{ name: 'MEN-DAR-30-16813717037' }],
                    },
                  ],
                  pricing: {
                    price: {
                      gross: { currency: 'USD', amount: 26.4 },
                      net: { currency: 'USD', amount: 26.4 },
                    },
                  },
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDM0',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'DARK BLUE' }],
                    },
                    { attribute: { name: 'Commission' }, values: [] },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '16.5' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: '32' }],
                    },
                    {
                      attribute: { name: 'sku' },
                      values: [{ name: 'MEN-DAR-32-16813717038' }],
                    },
                  ],
                  pricing: {
                    price: {
                      gross: { currency: 'USD', amount: 26.4 },
                      net: { currency: 'USD', amount: 26.4 },
                    },
                  },
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDM2',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'DARK BLUE' }],
                    },
                    { attribute: { name: 'Commission' }, values: [] },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '16.5' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: '34' }],
                    },
                    {
                      attribute: { name: 'sku' },
                      values: [{ name: 'MEN-DAR-34-16813717039' }],
                    },
                  ],
                  pricing: {
                    price: {
                      gross: { currency: 'USD', amount: 26.4 },
                      net: { currency: 'USD', amount: 26.4 },
                    },
                  },
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDM4',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'DARK BLUE' }],
                    },
                    { attribute: { name: 'Commission' }, values: [] },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '16.5' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: '36' }],
                    },
                    {
                      attribute: { name: 'sku' },
                      values: [{ name: 'MEN-DAR-36-168137170310' }],
                    },
                  ],
                  pricing: {
                    price: {
                      gross: { currency: 'USD', amount: 26.4 },
                      net: { currency: 'USD', amount: 26.4 },
                    },
                  },
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDQw',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'DARK BLUE' }],
                    },
                    { attribute: { name: 'Commission' }, values: [] },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '16.5' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: '38' }],
                    },
                    {
                      attribute: { name: 'sku' },
                      values: [{ name: 'MEN-DAR-38-168137170311' }],
                    },
                  ],
                  pricing: {
                    price: {
                      gross: { currency: 'USD', amount: 26.4 },
                      net: { currency: 'USD', amount: 26.4 },
                    },
                  },
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDQy',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'DARK BLUE' }],
                    },
                    { attribute: { name: 'Commission' }, values: [] },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '16.5' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: '40' }],
                    },
                    {
                      attribute: { name: 'sku' },
                      values: [{ name: 'MEN-DAR-40-168137170312' }],
                    },
                  ],
                  pricing: {
                    price: {
                      gross: { currency: 'USD', amount: 26.4 },
                      net: { currency: 'USD', amount: 26.4 },
                    },
                  },
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDQ0',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'DARK BLUE' }],
                    },
                    { attribute: { name: 'Commission' }, values: [] },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '16.5' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: '42' }],
                    },
                    {
                      attribute: { name: 'sku' },
                      values: [{ name: 'MEN-DAR-42-168137170313' }],
                    },
                  ],
                  pricing: {
                    price: {
                      gross: { currency: 'USD', amount: 26.4 },
                      net: { currency: 'USD', amount: 26.4 },
                    },
                  },
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDQ2',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'MEDIUM BLUE' }],
                    },
                    { attribute: { name: 'Commission' }, values: [] },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '16.5' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: '30' }],
                    },
                    {
                      attribute: { name: 'sku' },
                      values: [{ name: 'MEN-MED-30-168137170314' }],
                    },
                  ],
                  pricing: {
                    price: {
                      gross: { currency: 'USD', amount: 26.4 },
                      net: { currency: 'USD', amount: 26.4 },
                    },
                  },
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDQ4',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'MEDIUM BLUE' }],
                    },
                    { attribute: { name: 'Commission' }, values: [] },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '16.5' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: '32' }],
                    },
                    {
                      attribute: { name: 'sku' },
                      values: [{ name: 'MEN-MED-32-168137170315' }],
                    },
                  ],
                  pricing: {
                    price: {
                      gross: { currency: 'USD', amount: 26.4 },
                      net: { currency: 'USD', amount: 26.4 },
                    },
                  },
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDUw',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'MEDIUM BLUE' }],
                    },
                    { attribute: { name: 'Commission' }, values: [] },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '16.5' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: '34' }],
                    },
                    {
                      attribute: { name: 'sku' },
                      values: [{ name: 'MEN-MED-34-168137170316' }],
                    },
                  ],
                  pricing: {
                    price: {
                      gross: { currency: 'USD', amount: 26.4 },
                      net: { currency: 'USD', amount: 26.4 },
                    },
                  },
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDUy',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'MEDIUM BLUE' }],
                    },
                    { attribute: { name: 'Commission' }, values: [] },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '16.5' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: '36' }],
                    },
                    {
                      attribute: { name: 'sku' },
                      values: [{ name: 'MEN-MED-36-168137170317' }],
                    },
                  ],
                  pricing: {
                    price: {
                      gross: { currency: 'USD', amount: 26.4 },
                      net: { currency: 'USD', amount: 26.4 },
                    },
                  },
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDU0',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'MEDIUM BLUE' }],
                    },
                    { attribute: { name: 'Commission' }, values: [] },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '16.5' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: '38' }],
                    },
                    {
                      attribute: { name: 'sku' },
                      values: [{ name: 'MEN-MED-38-168137170318' }],
                    },
                  ],
                  pricing: {
                    price: {
                      gross: { currency: 'USD', amount: 26.4 },
                      net: { currency: 'USD', amount: 26.4 },
                    },
                  },
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDU2',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'MEDIUM BLUE' }],
                    },
                    { attribute: { name: 'Commission' }, values: [] },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '16.5' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: '40' }],
                    },
                    {
                      attribute: { name: 'sku' },
                      values: [{ name: 'MEN-MED-40-168137170319' }],
                    },
                  ],
                  pricing: {
                    price: {
                      gross: { currency: 'USD', amount: 26.4 },
                      net: { currency: 'USD', amount: 26.4 },
                    },
                  },
                },
                {
                  id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDU3',
                  attributes: [
                    {
                      attribute: { name: 'Color' },
                      values: [{ name: 'MEDIUM BLUE' }],
                    },
                    { attribute: { name: 'Commission' }, values: [] },
                    {
                      attribute: { name: 'Cost Price' },
                      values: [{ name: '16.5' }],
                    },
                    {
                      attribute: { name: 'Size' },
                      values: [{ name: '42' }],
                    },
                    {
                      attribute: { name: 'sku' },
                      values: [{ name: 'MEN-MED-42-168137170320' }],
                    },
                  ],
                  pricing: {
                    price: {
                      gross: { currency: 'USD', amount: 26.4 },
                      net: { currency: 'USD', amount: 26.4 },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  },
  mockShop: {
    id: '1031',
    name: 'Wakefa Soomb',
    email: 'wakefa4212@soombo.com',
    url: 'https://wakefaj6la6.com',
    madeIn: '',
    minOrder: 0,
    description: '',
    about: '',
    returnPolicy: '',
    storePolicy: '',
    fields: [
      { name: 'logo', values: [''] },
      { name: 'banner', values: [''] },
      { name: 'facebook', values: [''] },
      { name: 'pinterest', values: [''] },
      { name: 'instagram', values: [''] },
      { name: 'twitter', values: [''] },
      { name: 'storefrontids', values: ['169'] },
      { name: 'storefronturls', values: ['wakefasoomb.sharove.co'] },
      { name: 'myvendors', values: ['610'] },
    ],
  },
  mockShopProducts: {
    totalCount: 111,
    pageInfo: {
      hasNextPage: true,
      hasPreviousPage: false,
      endCursor: 'WyJVSEp2WkhWamREb3hNVGt6TlRNPSJd',
      startCursor: 'WyJVSEp2WkhWamREb3hNVGt6TlRNPSJd',
    },
    edges: [
      {
        cursor: 'WyJVSEp2WkhWamREb3hNVGt6TlRNPSJd',
        node: { productId: 'UHJvZHVjdDoxMTkzNTM=' },
      },
    ],
  },
  mockMyProducts: {
    totalCount: 1,
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      endCursor: 'WyJtZW5zLXN0cmFpZ2h0LWZpdC1qZWFuc3MwZ2hlIl0=',
      startCursor: 'WyJtZW5zLXN0cmFpZ2h0LWZpdC1qZWFuc3MwZ2hlIl0=',
    },
    edges: [
      {
        node: {
          id: 'UHJvZHVjdDoxMTkzNTM=',
          description: `{"time": 1662995227870, "blocks": [{"id": "cqWmV3MIPH", "data": {"text": "Men's Straight Fit Jeans  Denim Fabric  5 Pockets 98% Cotton & 2% Spandex  Sizes: 30-42 Open Stock  Available in 30 & 32 Length Only Imported  Model is 6'2 Wearing size 32/32"}, "type": "paragraph"}], "version": "2.24.3"}`,
          name: 'MENS STRAIGHT FIT JEANS',
          slug: 'mens-straight-fit-jeanss0ghe',
          thumbnail: {
            url: 'http://localhost:8000/media/202206/V/d9de39ac-f654-11ec-9274-0626c5bd3ecf_V.jpg',
          },
          metadata: [
            { key: 'vendorId', value: '318' },
            { key: 'vendorName', value: 'HAWKSBAY Collection' },
          ],
          category: {
            id: 'Q2F0ZWdvcnk6MjM2',
            name: 'BOTTOMS',
            ancestors: {
              edges: [{ node: { id: 'Q2F0ZWdvcnk6MTg=', name: 'MEN' } }],
            },
          },
          media: [
            {
              url: 'http://localhost:8000/media/202206/E/d9de39ac-f654-11ec-9274-0626c5bd3ecf_E.jpg',
            },
            {
              url: 'http://localhost:8000/media/202206/E/d3cf09c4-f654-11ec-9273-0626c5bd3ecf_E.jpg',
            },
            {
              url: 'http://localhost:8000/media/202206/E/d3d30b82-f654-11ec-9273-0626c5bd3ecf_E.jpg',
            },
            {
              url: 'http://localhost:8000/media/202206/E/d9de386c-f654-11ec-9273-0626c5bd3ecf_E.jpg',
            },
            {
              url: 'http://localhost:8000/media/202206/E/d9e27670-f654-11ec-9274-0626c5bd3ecf_E.jpg',
            },
            {
              url: 'http://localhost:8000/media/202206/E/d9e721b6-f654-11ec-9274-0626c5bd3ecf_E.jpg',
            },
            {
              url: 'http://localhost:8000/media/202206/E/d9e11c6c-f654-11ec-9274-0626c5bd3ecf_E.jpg',
            },
            {
              url: 'http://localhost:8000/media/202206/E/e08989fa-f654-11ec-9274-0626c5bd3ecf_E.jpg',
            },
            {
              url: 'http://localhost:8000/media/202206/E/e0912192-f654-11ec-9274-0626c5bd3ecf_E.jpg',
            },
            {
              url: 'http://localhost:8000/media/ColorSwatch/202206/cf80641c-f654-11ec-9273-0626c5bd3ecf.jpg',
            },
            {
              url: 'http://localhost:8000/media/ColorSwatch/202206/cbf9af38-f654-11ec-9273-0626c5bd3ecf.jpg',
            },
            {
              url: 'http://localhost:8000/media/ColorSwatch/202206/c79c9770-f654-11ec-9273-0626c5bd3ecf.jpg',
            },
          ],
          variants: [
            {
              id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDIx',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'BLACK' }],
                },
                { attribute: { name: 'Commission' }, values: [] },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '16.5' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: '30' }],
                },
                {
                  attribute: { name: 'sku' },
                  values: [{ name: 'MEN-BLA-30-16813717030' }],
                },
              ],
              pricing: {
                price: {
                  gross: { currency: 'USD', amount: 26.4 },
                  net: { currency: 'USD', amount: 26.4 },
                },
              },
            },
            {
              id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDIz',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'BLACK' }],
                },
                { attribute: { name: 'Commission' }, values: [] },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '16.5' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: '32' }],
                },
                {
                  attribute: { name: 'sku' },
                  values: [{ name: 'MEN-BLA-32-16813717031' }],
                },
              ],
              pricing: {
                price: {
                  gross: { currency: 'USD', amount: 26.4 },
                  net: { currency: 'USD', amount: 26.4 },
                },
              },
            },
            {
              id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDI1',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'BLACK' }],
                },
                { attribute: { name: 'Commission' }, values: [] },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '16.5' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: '34' }],
                },
                {
                  attribute: { name: 'sku' },
                  values: [{ name: 'MEN-BLA-34-16813717032' }],
                },
              ],
              pricing: {
                price: {
                  gross: { currency: 'USD', amount: 26.4 },
                  net: { currency: 'USD', amount: 26.4 },
                },
              },
            },
            {
              id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDI3',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'BLACK' }],
                },
                { attribute: { name: 'Commission' }, values: [] },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '16.5' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: '36' }],
                },
                {
                  attribute: { name: 'sku' },
                  values: [{ name: 'MEN-BLA-36-16813717033' }],
                },
              ],
              pricing: {
                price: {
                  gross: { currency: 'USD', amount: 26.4 },
                  net: { currency: 'USD', amount: 26.4 },
                },
              },
            },
            {
              id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDI5',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'BLACK' }],
                },
                { attribute: { name: 'Commission' }, values: [] },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '16.5' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: '38' }],
                },
                {
                  attribute: { name: 'sku' },
                  values: [{ name: 'MEN-BLA-38-16813717034' }],
                },
              ],
              pricing: {
                price: {
                  gross: { currency: 'USD', amount: 26.4 },
                  net: { currency: 'USD', amount: 26.4 },
                },
              },
            },
            {
              id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDMw',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'BLACK' }],
                },
                { attribute: { name: 'Commission' }, values: [] },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '16.5' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: '40' }],
                },
                {
                  attribute: { name: 'sku' },
                  values: [{ name: 'MEN-BLA-40-16813717035' }],
                },
              ],
              pricing: {
                price: {
                  gross: { currency: 'USD', amount: 26.4 },
                  net: { currency: 'USD', amount: 26.4 },
                },
              },
            },
            {
              id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDMx',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'BLACK' }],
                },
                { attribute: { name: 'Commission' }, values: [] },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '16.5' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: '42' }],
                },
                {
                  attribute: { name: 'sku' },
                  values: [{ name: 'MEN-BLA-42-16813717036' }],
                },
              ],
              pricing: {
                price: {
                  gross: { currency: 'USD', amount: 26.4 },
                  net: { currency: 'USD', amount: 26.4 },
                },
              },
            },
            {
              id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDMy',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'DARK BLUE' }],
                },
                { attribute: { name: 'Commission' }, values: [] },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '16.5' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: '30' }],
                },
                {
                  attribute: { name: 'sku' },
                  values: [{ name: 'MEN-DAR-30-16813717037' }],
                },
              ],
              pricing: {
                price: {
                  gross: { currency: 'USD', amount: 26.4 },
                  net: { currency: 'USD', amount: 26.4 },
                },
              },
            },
            {
              id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDM0',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'DARK BLUE' }],
                },
                { attribute: { name: 'Commission' }, values: [] },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '16.5' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: '32' }],
                },
                {
                  attribute: { name: 'sku' },
                  values: [{ name: 'MEN-DAR-32-16813717038' }],
                },
              ],
              pricing: {
                price: {
                  gross: { currency: 'USD', amount: 26.4 },
                  net: { currency: 'USD', amount: 26.4 },
                },
              },
            },
            {
              id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDM2',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'DARK BLUE' }],
                },
                { attribute: { name: 'Commission' }, values: [] },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '16.5' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: '34' }],
                },
                {
                  attribute: { name: 'sku' },
                  values: [{ name: 'MEN-DAR-34-16813717039' }],
                },
              ],
              pricing: {
                price: {
                  gross: { currency: 'USD', amount: 26.4 },
                  net: { currency: 'USD', amount: 26.4 },
                },
              },
            },
            {
              id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDM4',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'DARK BLUE' }],
                },
                { attribute: { name: 'Commission' }, values: [] },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '16.5' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: '36' }],
                },
                {
                  attribute: { name: 'sku' },
                  values: [{ name: 'MEN-DAR-36-168137170310' }],
                },
              ],
              pricing: {
                price: {
                  gross: { currency: 'USD', amount: 26.4 },
                  net: { currency: 'USD', amount: 26.4 },
                },
              },
            },
            {
              id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDQw',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'DARK BLUE' }],
                },
                { attribute: { name: 'Commission' }, values: [] },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '16.5' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: '38' }],
                },
                {
                  attribute: { name: 'sku' },
                  values: [{ name: 'MEN-DAR-38-168137170311' }],
                },
              ],
              pricing: {
                price: {
                  gross: { currency: 'USD', amount: 26.4 },
                  net: { currency: 'USD', amount: 26.4 },
                },
              },
            },
            {
              id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDQy',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'DARK BLUE' }],
                },
                { attribute: { name: 'Commission' }, values: [] },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '16.5' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: '40' }],
                },
                {
                  attribute: { name: 'sku' },
                  values: [{ name: 'MEN-DAR-40-168137170312' }],
                },
              ],
              pricing: {
                price: {
                  gross: { currency: 'USD', amount: 26.4 },
                  net: { currency: 'USD', amount: 26.4 },
                },
              },
            },
            {
              id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDQ0',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'DARK BLUE' }],
                },
                { attribute: { name: 'Commission' }, values: [] },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '16.5' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: '42' }],
                },
                {
                  attribute: { name: 'sku' },
                  values: [{ name: 'MEN-DAR-42-168137170313' }],
                },
              ],
              pricing: {
                price: {
                  gross: { currency: 'USD', amount: 26.4 },
                  net: { currency: 'USD', amount: 26.4 },
                },
              },
            },
            {
              id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDQ2',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'MEDIUM BLUE' }],
                },
                { attribute: { name: 'Commission' }, values: [] },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '16.5' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: '30' }],
                },
                {
                  attribute: { name: 'sku' },
                  values: [{ name: 'MEN-MED-30-168137170314' }],
                },
              ],
              pricing: {
                price: {
                  gross: { currency: 'USD', amount: 26.4 },
                  net: { currency: 'USD', amount: 26.4 },
                },
              },
            },
            {
              id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDQ4',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'MEDIUM BLUE' }],
                },
                { attribute: { name: 'Commission' }, values: [] },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '16.5' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: '32' }],
                },
                {
                  attribute: { name: 'sku' },
                  values: [{ name: 'MEN-MED-32-168137170315' }],
                },
              ],
              pricing: {
                price: {
                  gross: { currency: 'USD', amount: 26.4 },
                  net: { currency: 'USD', amount: 26.4 },
                },
              },
            },
            {
              id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDUw',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'MEDIUM BLUE' }],
                },
                { attribute: { name: 'Commission' }, values: [] },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '16.5' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: '34' }],
                },
                {
                  attribute: { name: 'sku' },
                  values: [{ name: 'MEN-MED-34-168137170316' }],
                },
              ],
              pricing: {
                price: {
                  gross: { currency: 'USD', amount: 26.4 },
                  net: { currency: 'USD', amount: 26.4 },
                },
              },
            },
            {
              id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDUy',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'MEDIUM BLUE' }],
                },
                { attribute: { name: 'Commission' }, values: [] },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '16.5' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: '36' }],
                },
                {
                  attribute: { name: 'sku' },
                  values: [{ name: 'MEN-MED-36-168137170317' }],
                },
              ],
              pricing: {
                price: {
                  gross: { currency: 'USD', amount: 26.4 },
                  net: { currency: 'USD', amount: 26.4 },
                },
              },
            },
            {
              id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDU0',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'MEDIUM BLUE' }],
                },
                { attribute: { name: 'Commission' }, values: [] },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '16.5' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: '38' }],
                },
                {
                  attribute: { name: 'sku' },
                  values: [{ name: 'MEN-MED-38-168137170318' }],
                },
              ],
              pricing: {
                price: {
                  gross: { currency: 'USD', amount: 26.4 },
                  net: { currency: 'USD', amount: 26.4 },
                },
              },
            },
            {
              id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDU2',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'MEDIUM BLUE' }],
                },
                { attribute: { name: 'Commission' }, values: [] },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '16.5' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: '40' }],
                },
                {
                  attribute: { name: 'sku' },
                  values: [{ name: 'MEN-MED-40-168137170319' }],
                },
              ],
              pricing: {
                price: {
                  gross: { currency: 'USD', amount: 26.4 },
                  net: { currency: 'USD', amount: 26.4 },
                },
              },
            },
            {
              id: 'UHJvZHVjdFZhcmlhbnQ6NTU5NDU3',
              attributes: [
                {
                  attribute: { name: 'Color' },
                  values: [{ name: 'MEDIUM BLUE' }],
                },
                { attribute: { name: 'Commission' }, values: [] },
                {
                  attribute: { name: 'Cost Price' },
                  values: [{ name: '16.5' }],
                },
                {
                  attribute: { name: 'Size' },
                  values: [{ name: '42' }],
                },
                {
                  attribute: { name: 'sku' },
                  values: [{ name: 'MEN-MED-42-168137170320' }],
                },
              ],
              pricing: {
                price: {
                  gross: { currency: 'USD', amount: 26.4 },
                  net: { currency: 'USD', amount: 26.4 },
                },
              },
            },
          ],
        },
      },
    ],
  },
};
