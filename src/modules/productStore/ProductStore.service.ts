import { Injectable } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareGQLPaginatedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import { ProductFilterDto } from 'src/modules/product/dto';
import {
  addToProductStoreHandler,
  deleteFromProductStoreHandler,
  getStoreInfoHandler,
  getStoredProductsHandler,
  updateStoreInfoHandler,
} from 'src/graphql/handlers/productStore';
import {
  addToProductStoreDTO,
  deleteFromProductStoreDTO,
} from './dto/products';
import { shopInfoDto } from '../orders/dto';
import { uploadImagesHandler } from 'src/external/services/uploadImages';

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

  /**
   * updates store details of the retailer store against shopId
   */
  public async updateStoreInfo(
    shopId: string,
    storeDetails: shopInfoDto,
    token: string,
  ): Promise<object> {
    try {
      return prepareSuccessResponse(
        await updateStoreInfoHandler(shopId, storeDetails, token),
      );
    } catch (error) {
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * Store images in s3 bucket and returns image url
   */
  public async uploadImages(file: any): Promise<object> {
    try {
      return prepareSuccessResponse(await uploadImagesHandler(file));
    } catch (error) {
      return graphqlExceptionHandler(error);
    }
  }
}
