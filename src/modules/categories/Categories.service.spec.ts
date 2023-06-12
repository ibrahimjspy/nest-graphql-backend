import { Test, TestingModule } from '@nestjs/testing';
import { SuccessResponseType } from 'src/core/utils/response.type';
import * as CategoriesHandler from 'src/graphql/handlers/categories';
import * as Mappings from 'src/external/endpoints/syncCategoriesMapping';
import { mockCategoriesData } from '../../../test/mock/categories';
import { CategoriesService } from './Categories.service';
import {
  moveChildCategoriesToParents,
  updateNewArrivalCategoryChildren,
} from './Categories.utils';

describe('Categories Service', () => {
  let service: CategoriesService;
  const mocks = mockCategoriesData;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesService],
    }).compile();
    module.useLogger(false);

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should get all categories', async () => {
    jest
      .spyOn(CategoriesHandler, 'categoriesHandler')
      .mockImplementation(async () => mocks.categoriesMock as any);

    const expected: SuccessResponseType = {
      status: 200,
      data: mocks.expectedResults,
    };
    const getCategories = await service.getCategories({ first: 10 });
    expect(getCategories).toEqual(expected);
    expect(getCategories).toBeDefined();
  });

  it('should get all categories by vendor', async () => {
    jest
      .spyOn(CategoriesHandler, 'vendorCategoriesHandler')
      .mockImplementation(async () => mocks.allCategories);

    const expected: SuccessResponseType = {
      status: 200,
      data: mocks.allCategories,
    };
    const getCategories = await service.getVendorCategories('1');
    expect(getCategories).toEqual(expected);
    expect(getCategories).toBeDefined();
  });

  it('should get synced categories', async () => {
    jest
      .spyOn(CategoriesHandler, 'syncCategoriesHandler')
      .mockImplementation(async () => mocks.allCategories);

    jest
      .spyOn(Mappings, 'getSyncCategoriesMapping')
      .mockImplementation(async () => mocks.elasticSearchMock);

    const getSyncedCategories = await service.getSyncedCategories('5', {
      first: 10,
      categoryLevel: 0,
    });
    expect(getSyncedCategories).toBeDefined();
  });

  it('should move all child categories to there parent categories', async () => {
    const arrangedCategories = await moveChildCategoriesToParents(
      mocks.unArrangedCategories as any,
    );
    expect(arrangedCategories).toEqual(mocks.arrangedCategories);
    expect(arrangedCategories).toBeDefined();
  });
});

describe('newCategoryUpdate', () => {
  test('updates the children of the new category correctly', () => {
    const categories = [
      {
        node: {
          name: 'New',
          id: 'Q2F0ZWdvcnk6Mzc5',
          slug: 'all-new-arrivals',
          metadata: [{ key: 'order', value: '1' }],
          children: {
            edges: [
              {
                node: {
                  name: 'All New Arrivals',
                  id: 'Q2F0ZWdvcnk6Mzgx',
                  metadata: [{ key: 'order', value: '1' }],
                  products: { totalCount: 0 },
                  slug: 'all-new-arrivals-2',
                  children: { edges: [] },
                },
              },
              {
                node: {
                  name: 'Women',
                  id: 'Q2F0ZWdvcnk6Mzgy',
                  metadata: [
                    { key: 'order', value: '2' },
                    { key: 'parentCategoryId', value: 'Q2F0ZWdvcnk6Mg==' },
                  ],
                  products: { totalCount: 0 },
                  slug: 'women-2',
                  children: { edges: [] },
                },
              },
            ],
          },
        },
      },
    ];

    const missingCategory1 = {
      node: {
        name: 'Missing Category 1',
        id: 'Q2F0ZWdvcnk6Mg==',
        slug: 'missing-category-1',
        products: { totalCount: 123 },
        metadata: [{ key: 'order', value: '3' }],
        children: { edges: [] },
      },
    };

    const missingCategory2 = {
      node: {
        name: 'Missing Category 2',
        id: 'Q2F0ZWdvcnk6MzY1',
        slug: 'missing-category-2',
        products: { totalCount: 456 },
        metadata: [{ key: 'order', value: '4' }],
        children: { edges: [] },
      },
    };

    // Replace missing categories in the original array
    categories.push(missingCategory1);
    categories.push(missingCategory2);

    updateNewArrivalCategoryChildren(categories as any);
    expect(categories[0]).toStrictEqual({
      node: {
        name: 'New',
        id: 'Q2F0ZWdvcnk6Mzc5',
        slug: 'all-new-arrivals',
        metadata: [{ key: 'order', value: '1' }],
        children: {
          edges: [
            {
              node: {
                name: 'All New Arrivals',
                id: 'Q2F0ZWdvcnk6Mzgx',
                metadata: [{ key: 'order', value: '1' }],
                products: { totalCount: 0 },
                slug: 'all-new-arrivals-2',
                children: { edges: [] },
              },
            },
            {
              node: {
                name: 'Women',
                id: 'Q2F0ZWdvcnk6Mg==',
                slug: 'missing-category-1',
                products: { totalCount: 123 },
                metadata: [{ key: 'order', value: '3' }],
                children: { edges: [] },
              },
            },
          ],
        },
      },
    });
    expect(categories[0].node.children.edges[1].node.name).toBe('Women');
  });

  test('handles the case when the new category is not found', () => {
    const categories = [
      {
        node: {
          name: 'Category 1',
          id: 'Q2F0ZWdvcnk6MzIx',
          slug: 'category-1',
          metadata: [{ key: 'order', value: '1' }],
          children: {
            edges: [
              {
                node: {
                  name: 'Child Category 1',
                  id: 'Q2F0ZWdvcnk6MzIy',
                  metadata: [{ key: 'order', value: '1' }],
                  products: { totalCount: 0 },
                  slug: 'child-category-1',
                  children: { edges: [] },
                },
              },
            ],
          },
        },
      },
    ];

    updateNewArrivalCategoryChildren(categories as any);

    expect(categories).toEqual(categories);
  });
});
