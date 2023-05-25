import { Test, TestingModule } from '@nestjs/testing';
import { SuccessResponseType } from 'src/core/utils/response.type';
import * as CategoriesHandler from 'src/graphql/handlers/categories';
import * as Mappings from 'src/external/endpoints/syncCategoriesMapping';
import { mockCategoriesData } from '../../../test/mock/categories';
import { CategoriesService } from './Categories.service';

describe('Categories Service', () => {
  let service: CategoriesService;
  let mocks;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesService],
    }).compile();
    module.useLogger(false);

    service = module.get<CategoriesService>(CategoriesService);
    mocks = mockCategoriesData;
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should get all categories', async () => {
    jest
      .spyOn(CategoriesHandler, 'categoriesHandler')
      .mockImplementation(async () => mocks.allCategories);

    const expected: SuccessResponseType = {
      status: 200,
      data: mocks.expectedResults,
    };
    const getCategories = await service.getCategories({ first: 10 });
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

  it('should get categories by shop', async () => {
    jest
      .spyOn(CategoriesHandler, 'shopCategoryIdsHandler')
      .mockImplementation(async () => mocks.categoriesByShop);

    jest
      .spyOn(CategoriesHandler, 'categoriesHandler')
      .mockImplementation(async () => mocks.shopCategoryData);

    const getShopCategories = await service.getShopCategories('162', {
      first: 10,
    });

    expect(getShopCategories).toEqual(mocks.expectedCategoriesByShop);
    expect(getShopCategories).toBeDefined();
  });
});
