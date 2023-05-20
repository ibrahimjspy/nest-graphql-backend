export const mockCategoriesData = {
  allCategories: {
    edges: [
      {
        node: {
          name: 'Default Category',
          id: 'Q2F0ZWdvcnk6MQ==',
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
        },
      },
    ],
  },
  expectedResults: [
    {
      node: {
        name: 'Women',
        id: 'Q2F0ZWdvcnk6MTg=',
        slug: 'women',
        products: {
          totalCount: 10000,
        },
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
            },
          },
        ],
      },
    },
  },
};
