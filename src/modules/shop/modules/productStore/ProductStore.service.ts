import { Injectable } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareSuccessResponse } from 'src/core/utils/response';
import { PushToStoreDto } from './dto/products';
import { uploadImagesHandler } from 'src/external/services/uploadImages';
import { ShopService } from '../../services.ts/shop/Shop.service';
import { pushToStoreHandler } from 'src/graphql/handlers/productStore';

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
}
