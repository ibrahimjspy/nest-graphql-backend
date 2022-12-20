import { Injectable, Logger } from '@nestjs/common';
import {
  carouselHandler,
  shopDetailsHandler,
  shopIdByVariantIdHandler,
} from 'src/graphql/handlers/shop';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareSuccessResponse } from 'src/core/utils/response';
import { shopIdByVariantsDTO } from './dto/shop';
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

  public async getShopIdByVariants(query: shopIdByVariantsDTO) {
    let response = [];
    await Promise.all(
      query.productVariantIds.map(async (variantId) => {
        const shopId = await shopIdByVariantIdHandler(variantId);
        response = [...response, shopId];
        return;
      }),
    );
    return prepareSuccessResponse(response, '', 200);
  }
}
