import { Injectable, Logger } from '@nestjs/common';
import {
  GetShopDetailsbyEmailHandler,
  carouselHandler,
  getShopBankDetailsHandler,
  getStoreFrontIdHandler,
  getStoreProductVariantsHandler,
  saveShopBankDetailsHandler,
  shopDetailsHandler,
  shopIdByOrderIdHandler,
  shopIdByVariantIdHandler,
  createStoreHandler,
  addStoreToShopHandler,
} from 'src/graphql/handlers/shop';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareSuccessResponse } from 'src/core/utils/response';
import { SuccessResponseType } from 'src/core/utils/response.type';
import { StoreDto } from './dto/shop';

import {
  validateStoreInput,
  getProductVariantIds,
  getStoreFrontFieldValues,
  validateArray,
} from './Shop.utils';
import {
  deleteBulkProductHandler,
  getMyProductsHandler,
  getProductIdsByVariantIdsHandler,
} from 'src/graphql/handlers/product';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';
@Injectable()
export class ShopService {
  private readonly logger = new Logger(ShopService.name);

  public getCarouselData(token: string): Promise<object> {
    // Pre graphQl call actions and validations -->
    // << -- >>
    // menuCategories is graphQl promise handler --->
    return carouselHandler(token);
  }

  public async createStore(
    shopId: string,
    storeInput: StoreDto,
    token: string,
  ): Promise<SuccessResponseType> {
    try {
      const response = await createStoreHandler(
        validateStoreInput(storeInput),
        token
      );
      // getting shop details by given shop id
      const shopDetail = await shopDetailsHandler(shopId)
      // Adding created store in user shop
      await addStoreToShopHandler(shopId, response.id, shopDetail, token)
      return prepareSuccessResponse(response, "", 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
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

  public async getShopDetailsbyEmail(email: string) {
    const response = await GetShopDetailsbyEmailHandler(email);
    return response;
  }

  public async getMyProducts(retailerId: string, pagination: PaginationDto) {
    try {
      let productIds = [];
      const retailer = await getStoreFrontIdHandler(retailerId);
      const storefrontIds = getStoreFrontFieldValues(retailer['fields']);
      await Promise.all(
        (storefrontIds || []).map(async (id) => {
          const productVariantIds = await getStoreProductVariantsHandler(id);
          const ids = await getProductIdsByVariantIdsHandler(
            getProductVariantIds(productVariantIds['productVariants']),
          );
          productIds = productIds.concat(ids);
        }),
      );

      if (productIds.length > 0) {
        return prepareSuccessResponse(
          [retailer, await getMyProductsHandler(productIds, pagination)],
          '',
          200,
        );
      }
      return prepareSuccessResponse(
        [retailer, []],
        'no products exists against given shop id',
        200,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async getShopBankDetails(shopId: string, token: string) {
    try {
      const response = await getShopBankDetailsHandler(shopId, token);
      return prepareSuccessResponse(response, '', 200);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async removeProductsFromMyProducts(productIds: string[], token) {
    try {
      const response = await deleteBulkProductHandler(
        productIds,
        token,
        'true',
      );
      return prepareSuccessResponse(response, '', 200);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async saveShopBankDetails(
    shopId: string,
    accountId: string,
    token: string,
  ) {
    try {
      const response = await saveShopBankDetailsHandler(
        shopId,
        accountId,
        token,
      );
      return prepareSuccessResponse(response, '', 200);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
