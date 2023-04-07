import { Injectable } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareGQLPaginatedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import {
  addToProductStoreHandler,
  deleteFromProductStoreHandler,
  getStoreInfoHandler,
  getStoredProductsHandler,
  pushToStoreHandler,
  updateStoreInfoHandler,
} from 'src/graphql/handlers/productStore';
import {
  PushToStoreDto,
  addToProductStoreDTO,
  deleteFromProductStoreDTO,
  getStoredProductsDTO,
} from './dto/products';
import { shopInfoDto } from '../orders/dto';
import { uploadImagesHandler } from 'src/external/services/uploadImages';
import { getProductIdsByVariants } from '../product/Product.utils';
import { getStoredProductListHandler } from 'src/graphql/handlers/product';
import {
  addProductListToStoredProducts,
  getIdsFromList,
} from './ProductStore.utils';
import { ShopService } from '../shop/Shop.service';

@Injectable()
export class ProductStoreService {
  constructor(private readonly shopService: ShopService) {
    return;
  }
  /**
   * Get stored products against a retailer
   */
  public async getStoredProducts(
    shopId: string,
    filter: getStoredProductsDTO,
  ): Promise<object> {
    try {
      const storedIds = await getStoredProductsHandler(shopId, filter);
      const storedProductList = await getStoredProductListHandler(
        getProductIdsByVariants(storedIds),
      );
      return prepareGQLPaginatedResponse(
        addProductListToStoredProducts(storedIds, storedProductList),
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
      const B2C_ENABLED = true;
      return prepareSuccessResponse(
        await getStoreInfoHandler(shopId, token, B2C_ENABLED),
      );
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
      const B2C_ENABLED = true;
      return prepareSuccessResponse(
        await updateStoreInfoHandler(shopId, storeDetails, token, B2C_ENABLED),
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
      const bucket = process.env.AWS_BUCKET_NAME;
      return prepareSuccessResponse(await uploadImagesHandler(file, bucket));
    } catch (error) {
      return graphqlExceptionHandler(error);
    }
  }

  public async pushToStore(
    pushToStoreInput: PushToStoreDto,
    token = '',
  ): Promise<object> {
    try {
      return prepareSuccessResponse(
        await pushToStoreHandler(pushToStoreInput, token),
      );
    } catch (error) {
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description - add bulk products to import list
   * @param an object containing product ids object array and retailer shop id
   * @step it for now is fetching vendors against product itself
   * @returns product store composite response
   * @links to push to store - as in case if user specifies add to import list as well before pushing to store
   */
  public async addBulkProductsToStore(
    pushToStoreInput: PushToStoreDto,
  ): Promise<object> {
    try {
      const productIds = getIdsFromList(pushToStoreInput.products);
      const productVendors = await this.shopService.getShopIdByProductIds(
        productIds,
      );
      const vendorIds = getIdsFromList(productVendors?.data);
      const retailerId = pushToStoreInput.shopId;
      const { ...response } = await Promise.all(
        productIds.map(async (productId, key) => {
          return await addToProductStoreHandler({
            productId: productId,
            vendorId: vendorIds[key],
            shopId: retailerId,
          });
        }),
      );
      return prepareSuccessResponse(response);
    } catch (error) {
      return graphqlExceptionHandler(error);
    }
  }
}
