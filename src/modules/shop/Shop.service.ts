import { Injectable, Logger } from '@nestjs/common';
import {
  carouselHandler,
  shopDetailsHandler,
  shopIdByOrderIdHandler,
  shopIdByVariantIdHandler,
  GetShopDetailsbyEmailHandler,
} from 'src/graphql/handlers/shop';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareSuccessResponse } from 'src/core/utils/response';
import { validateArray } from './Shop.utils';
@Injectable()
export class ShopService {
  private readonly logger = new Logger(ShopService.name);

  public getCarouselData(token: string): Promise<object> {
    // Pre graphQl call actions and validations -->
    // << -- >>
    // menuCategories is graphQl promise handler --->
    return carouselHandler(token);
  }

  public async getShopDetails(shopId: string): Promise<object> {
    try {
      const response = await shopDetailsHandler(shopId);
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async getShopIdByVariants(productVariantIds) {
    try {
      const ids = validateArray(productVariantIds);
      let response = [];
      await Promise.all(
        ids.map(async (variantId) => {
          const shopId = await shopIdByVariantIdHandler(variantId);
          response = [...response, shopId];
        }),
      );
      return prepareSuccessResponse(response, '', 200);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async getShopIdByOrders(orderIds) {
    try {
      const ids = validateArray(orderIds);
      let response = [];
      await Promise.all(
        ids.map(async (orderId) => {
          const shopId = await shopIdByOrderIdHandler(orderId);
          response = [...response, shopId];
        }),
      );
      return prepareSuccessResponse(response, '', 200);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async GetShopDetailsbyEmail(Email: any) {
    try {
      const ShopDetails_Response = await GetShopDetailsbyEmailHandler(Email);
      return prepareSuccessResponse(ShopDetails_Response, '', 200);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
