import { Injectable } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareGQLPaginatedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import { ProductFilterDto } from 'src/modules/product/dto';
import {
  getStoreInfoHandler,
  addToProductStoreHandler,
  deleteFromProductStoreHandler,
  getStoredProductsHandler,
} from 'src/graphql/handlers/productStore';
import {
  addToProductStoreDTO,
  deleteFromProductStoreDTO,
} from './dto/products';

@Injectable()
export class ProductStoreService {
  /**
   * Get products list from PIM
   */
  public async getStoredProducts(
    shopId: string,
    filter: ProductFilterDto,
  ): Promise<object> {
    try {
      return prepareGQLPaginatedResponse(
        await getStoredProductsHandler(shopId, filter),
      );
    } catch (error) {
      return graphqlExceptionHandler(error);
    }
  }
  /**
   * add product and variants against shop in store
   */
  public async addToProductStore(
    productsData: addToProductStoreDTO,
  ): Promise<object> {
    try {
      return prepareSuccessResponse(
        await addToProductStoreHandler(productsData),
      );
    } catch (error) {
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * deletes product and variants against shop in store
   */
  public async deleteFromProductStore(
    productsData: deleteFromProductStoreDTO,
  ): Promise<object> {
    try {
      return prepareSuccessResponse(
        await deleteFromProductStoreHandler(productsData),
      );
    } catch (error) {
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * returns store details of the retailer store against shopId
   */
  public async getStoreInfo(shopId: string, token: string): Promise<object> {
    try {
      return prepareSuccessResponse(await getStoreInfoHandler(shopId, token));
    } catch (error) {
      return graphqlExceptionHandler(error);
    }
  }
}
