import { Injectable } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareSuccessResponse } from 'src/core/utils/response';
import {
  addToProductStoreHandler,
  pushToStoreHandler,
} from 'src/graphql/handlers/productStore';
import { PushToStoreDto } from './dto/products';
import { uploadImagesHandler } from 'src/external/services/uploadImages';
import { getIdsFromList } from './ProductStore.utils';
import { ShopService } from '../shop/Shop.service';

@Injectable()
export class ProductStoreService {
  constructor(private readonly shopService: ShopService) {
    return;
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
