import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareSuccessResponse } from 'src/core/utils/response';
import { SuccessResponseType } from 'src/core/utils/response.type';
import {
  addVendorsToShopHandler,
  getShopDetailsV2Handler,
  removeMyVendorsHandler,
} from 'src/graphql/handlers/shop';
import { getMyVendorsFieldValues } from '../../Shop.utils';

@Injectable()
export class MyVendorsService {
  private readonly logger = new Logger(MyVendorsService.name);

  public async addVendorsToShop(
    shopId: string,
    vendorIds: number[],
    token: string,
  ): Promise<SuccessResponseType> {
    try {
      this.logger.log(`Adding vendors to shop ${shopId}`, vendorIds);
      const shopDetail = await getShopDetailsV2Handler({ id: shopId });
      const response = await addVendorsToShopHandler(
        shopId,
        vendorIds,
        shopDetail,
        token,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async getMyVendors(shopId: string): Promise<SuccessResponseType> {
    try {
      const response = [];
      const shopDetail = await getShopDetailsV2Handler({ id: shopId });
      const vendorIds = getMyVendorsFieldValues(shopDetail['fields']);
      await Promise.all(
        (vendorIds || []).map(async (vendorId) => {
          const vendorDetail = await getShopDetailsV2Handler({ id: vendorId });
          response.push({ vendorDetail });
        }),
      );
      return prepareSuccessResponse(
        response,
        response.length > 0 ? '' : 'no vendors exist against this retailer',
        201,
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async removeMyVendorsToShop(
    shopId: string,
    vendorIds: number[],
    token: string,
  ): Promise<SuccessResponseType> {
    try {
      const shopDetail = await getShopDetailsV2Handler({ id: shopId });
      const response = await removeMyVendorsHandler(
        shopId,
        vendorIds,
        shopDetail,
        token,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
