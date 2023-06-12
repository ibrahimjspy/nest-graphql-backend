export const mockCategoriesData = {
  allCategories: {
    edges: [
      {
        node: {
          name: 'Default Category',
          id: 'Q2F0ZWdvcnk6MQ==',
          products: {
            totalCount: 10000,
          },
          metadata: [
            {
              key: 'display',
              value: 'none',
            },
          ],
          slug: 'default-category',
          children: { edges: [] },
        },
      },
      {
        node: {
          name: 'Women',
          id: 'Q2F0ZWdvcnk6MTg=',
          slug: 'women',
          products: {
            totalCount: 10000,
          },
          metadata: [
            {
              key: 'order',
              value: '2',
            },
          ],
          children: {
            edges: [
              {
                node: {
                  name: 'LOUNGE WEAR',
                  id: 'Q2F0ZWdvcnk6MjI=',
                  slug: 'lounge-wear',
                  products: {
                    totalCount: 10000,
                  },
                  children: {
                    edges: [
                      {
                        node: {
                          name: 'PANTS',
                          products: {
                            totalCount: 0,
                          },
                          id: 'Q2F0ZWdvcnk6NjU=',
                          slug: 'pants-2',
                        },
                      },
                      {
                        node: {
                          name: 'SETS',
                          products: {
                            totalCount: 10000,
                          },
                          id: 'Q2F0ZWdvcnk6Njg=',
                          slug: 'sets-2',
                        },
                      },
                    ],
                  },
                },
              },
              {
                node: {
                  name: 'DRESSES',
                  id: 'Q2F0ZWdvcnk6MTI=',
                  slug: 'dresses',
                  products: {
                    totalCount: 10000,
                  },
                  children: {
                    edges: [
                      {
                        node: {
                          name: 'CASUAL',
                          products: {
                            totalCount: 10000,
                          },
                          id: 'Q2F0ZWdvcnk6NDc=',
                          slug: 'casual',
                        },
                      },
                      {
                        node: {
                          name: 'CLASSIC AND CAREER',
                          id: 'Q2F0ZWdvcnk6NDg=',
                          products: {
                            totalCount: 0,
                          },
                          slug: 'classic-and-career',
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
    ],
  },
  expectedResults: [
    {
      node: {
        id: 'Q2F0ZWdvcnk6Mg==',
        name: 'Women',
        slug: 'women',
        level: 0,
        metadata: [{ key: 'order', value: '2' }],
        products: { totalCount: 7273 },
        ancestors: { edges: [] },
        children: {
          edges: [
            {
              node: {
                id: 'Q2F0ZWdvcnk6MjI=',
                name: 'LOUNGE WEAR',
                slug: 'lounge-wear',
                level: 1,
                products: { totalCount: 5 },
                metadata: [],
                children: {
                  edges: [
                    {
                      node: {
                        id: 'Q2F0ZWdvcnk6NjU=',
                        name: 'PANTS',
                        slug: 'pants-2',
                        level: 2,
                        products: { totalCount: 1 },
                        metadata: [],
                      },
                    },
                    {
                      node: {
                        id: 'Q2F0ZWdvcnk6Njg=',
                        name: 'SETS',
                        slug: 'sets-2',
                        level: 2,
                        products: { totalCount: 3 },
                        metadata: [],
                      },
                    },
                  ],
                },
              },
            },
            {
              node: {
                id: 'Q2F0ZWdvcnk6MTI=',
                name: 'DRESSES',
                slug: 'dresses',
                level: 1,
                products: { totalCount: 1135 },
                metadata: [],
                children: {
                  edges: [
                    {
                      node: {
                        id: 'Q2F0ZWdvcnk6NDc=',
                        name: 'CASUAL',
                        slug: 'casual',
                        level: 2,
                        products: { totalCount: 294 },
                        metadata: [],
                      },
                    },
                    {
                      node: {
                        id: 'Q2F0ZWdvcnk6NDg=',
                        name: 'CLASSIC AND CAREER',
                        slug: 'classic-and-career',
                        level: 2,
                        products: { totalCount: 15 },
                        metadata: [],
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
  ],
  elasticSearchMock: {
    meta: {
      alerts: [],
      warnings: [],
      precision: 2,
      engine: { name: 'auto-sync-category-mapping', type: 'default' },
      page: { current: 1, total_pages: 1, total_results: 1, size: 100 },
      request_id: '8V_LBRLgSq6h0_-ZzY83OA',
    },
    results: [
      {
        shr_category_id: { raw: 'Q2F0ZWdvcnk6MTg=' },
        shr_retailer_shop_id: { raw: '927' },
        id: { raw: 'doc-6458a4bab3f90a91ec9a9c4c' },
        _meta: {
          id: 'doc-6458a4bab3f90a91ec9a9c4c',
          engine: 'auto-sync-category-mapping',
          score: 1,
        },
      },
    ],
  },
  expectedSyncedCategoriesResult: {
    edges: [
      {
        node: {
          name: 'Default Category',
          id: 'Q2F0ZWdvcnk6MQ==',
          slug: 'default-category',
          children: { edges: [] },
          sync: false,
          metadata: [
            {
              key: 'display',
              value: 'none',
            },
          ],
        },
      },
      {
        node: {
          name: 'Women',
          id: 'Q2F0ZWdvcnk6MTg=',
          slug: 'women',
          products: {
            totalCount: 100,
          },
          metadata: [
            {
              key: 'order',
              value: '2',
            },
          ],
          children: {
            edges: [
              {
                node: {
                  name: 'LOUNGE WEAR',
                  id: 'Q2F0ZWdvcnk6MjI=',
                  slug: 'lounge-wear',
                  children: {
                    edges: [
                      {
                        node: {
                          name: 'PANTS',
                          id: 'Q2F0ZWdvcnk6NjU=',
                          slug: 'pants-2',
                        },
                      },
                      {
                        node: {
                          name: 'SETS',
                          id: 'Q2F0ZWdvcnk6Njg=',
                          slug: 'sets-2',
                        },
                      },
                    ],
                  },
                },
              },
              {
                node: {
                  name: 'DRESSES',
                  id: 'Q2F0ZWdvcnk6MTI=',
                  slug: 'dresses',
                  children: {
                    edges: [
                      {
                        node: {
                          name: 'CASUAL',
                          id: 'Q2F0ZWdvcnk6NDc=',
                          slug: 'casual',
                        },
                      },
                      {
                        node: {
                          name: 'CLASSIC AND CAREER',
                          id: 'Q2F0ZWdvcnk6NDg=',
                          slug: 'classic-and-career',
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
          sync: true,
        },
      },
    ],
  },
  categoriesByShop: { categoryIds: ['Q2F0ZWdvcnk6Mg=='] },

  shopCategoryData: {
    edges: [
      {
        node: {
          name: 'Women',
          id: 'Q2F0ZWdvcnk6Mg==',
          slug: 'women',
          level: 0,
          metadata: [
            {
              key: 'order',
              value: '2',
            },
          ],
          products: { totalCount: 10000 },
          children: [],
        },
      },
    ],
  },
  expectedCategoriesByShop: {
    status: 200,
    data: {
      marketplace: { categoryIds: ['Q2F0ZWdvcnk6Mg=='] },
      saleor: {
        edges: [
          {
            node: {
              name: 'Women',
              id: 'Q2F0ZWdvcnk6Mg==',
              slug: 'women',
              level: 0,
              metadata: [{ key: 'order', value: '2' }],
              products: { totalCount: 10000 },
              children: [{ edges: [] }],
            },
          },
        ],
      },
    },
  },
  unArrangedCategories: {
    edges: [
      {
        node: {
          name: 'Women',
          id: 'Q2F0ZWdvcnk6Mg==',
          slug: 'women',
          products: { totalCount: 10000 },
          level: 0,
          children: {
            edges: [],
          },
          metadata: [
            {
              key: 'order',
              value: '2',
            },
          ],
        },
      },
      {
        node: {
          name: 'LEGGINGS',
          id: 'Q2F0ZWdvcnk6NTc=',
          slug: 'leggings',
          level: 2,
          metadata: [],
          products: { totalCount: 10000 },
          ancestors: {
            edges: [
              {
                node: {
                  id: 'Q2F0ZWdvcnk6Mg==',
                  name: 'Women',
                  level: 0,
                  metadata: [],
                  products: { totalCount: 10000 },
                },
              },
              {
                node: {
                  id: 'Q2F0ZWdvcnk6MTk=',
                  name: 'BOTTOMS',
                  level: 1,
                  metadata: [],
                  products: { totalCount: 10000 },
                },
              },
            ],
          },
          children: {
            edges: [],
          },
        },
      },
      {
        node: {
          name: 'JEANS',
          id: 'Q2F0ZWdvcnk6NjI=',
          slug: 'jeans',
          metadata: [],
          products: { totalCount: 10000 },
          level: 2,
          ancestors: {
            edges: [
              {
                node: {
                  id: 'Q2F0ZWdvcnk6Mg==',
                  name: 'Women',
                  metadata: [
                    {
                      key: 'order',
                      value: '2',
                    },
                  ],
                  products: { totalCount: 10000 },
                  level: 0,
                },
              },
              {
                node: {
                  id: 'Q2F0ZWdvcnk6MTk=',
                  name: 'BOTTOMS',
                  metadata: [],
                  products: { totalCount: 10000 },
                  level: 1,
                },
              },
            ],
          },
          children: {
            edges: [],
          },
        },
      },
    ],
  },
  arrangedCategories: {
    edges: [
      {
        node: {
          name: 'Women',
          id: 'Q2F0ZWdvcnk6Mg==',
          slug: 'women',
          metadata: [
            {
              key: 'order',
              value: '2',
            },
          ],
          products: { totalCount: 10000 },
          level: 0,
          children: {
            edges: [
              {
                node: {
                  id: 'Q2F0ZWdvcnk6MTk=',
                  name: 'BOTTOMS',
                  products: { totalCount: 10000 },
                  level: 1,
                  metadata: [],
                  children: {
                    edges: [
                      {
                        node: {
                          name: 'LEGGINGS',
                          id: 'Q2F0ZWdvcnk6NTc=',
                          slug: 'leggings',
                          metadata: [],
                          products: { totalCount: 10000 },
                          level: 2,
                          ancestors: {
                            edges: [],
                          },
                          children: {
                            edges: [],
                          },
                        },
                      },
                      {
                        node: {
                          name: 'JEANS',
                          id: 'Q2F0ZWdvcnk6NjI=',
                          slug: 'jeans',
                          products: { totalCount: 10000 },
                          level: 2,
                          ancestors: {
                            edges: [],
                          },
                          metadata: [],

                          children: {
                            edges: [],
                          },
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
    ],
  },
  categoriesMock: {
    edges: [
      {
        node: {
          id: 'Q2F0ZWdvcnk6MQ==',
          name: 'Default Category',
          slug: 'default-category',
          level: 0,
          metadata: [{ key: 'display', value: 'none' }],
          products: { totalCount: 15 },
          ancestors: { edges: [] },
          children: { edges: [] },
        },
      },
      {
        node: {
          id: 'Q2F0ZWdvcnk6Mg==',
          name: 'Women',
          slug: 'women',
          level: 0,
          metadata: [{ key: 'order', value: '2' }],
          products: { totalCount: 7273 },
          ancestors: { edges: [] },
          children: {
            edges: [
              {
                node: {
                  id: 'Q2F0ZWdvcnk6MjI=',
                  name: 'LOUNGE WEAR',
                  slug: 'lounge-wear',
                  level: 1,
                  products: { totalCount: 5 },
                  metadata: [],
                  children: {
                    edges: [
                      {
                        node: {
                          id: 'Q2F0ZWdvcnk6NjU=',
                          name: 'PANTS',
                          slug: 'pants-2',
                          level: 2,
                          products: { totalCount: 1 },
                          metadata: [],
                        },
                      },
                      {
                        node: {
                          id: 'Q2F0ZWdvcnk6Njg=',
                          name: 'SETS',
                          slug: 'sets-2',
                          level: 2,
                          products: { totalCount: 3 },
                          metadata: [],
                        },
                      },
                    ],
                  },
                },
              },
              {
                node: {
                  id: 'Q2F0ZWdvcnk6MTI=',
                  name: 'DRESSES',
                  slug: 'dresses',
                  level: 1,
                  products: { totalCount: 1135 },
                  metadata: [],
                  children: {
                    edges: [
                      {
                        node: {
                          id: 'Q2F0ZWdvcnk6NDc=',
                          name: 'CASUAL',
                          slug: 'casual',
                          level: 2,
                          products: { totalCount: 294 },
                          metadata: [],
                        },
                      },
                      {
                        node: {
                          id: 'Q2F0ZWdvcnk6NDg=',
                          name: 'CLASSIC AND CAREER',
                          slug: 'classic-and-career',
                          level: 2,
                          products: { totalCount: 15 },
                          metadata: [],
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
    ],
  },
};
