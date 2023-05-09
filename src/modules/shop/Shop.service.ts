import { Injectable, Logger } from '@nestjs/common';
import {
  addStoreToShopHandler,
  addVendorsToShopHandler,
  createStoreHandler,
  getAllShopsHandler,
  getShopBankDetailsHandler,
  getShopDetailsV2Handler,
  removeMyVendorsHandler,
  removeProductsFromShopHandler,
  saveShopBankDetailsHandler,
  shopIdByOrderIdHandler,
  shopIdByProductIdHandler,
  updateStoreInfoHandler,
} from 'src/graphql/handlers/shop';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareSuccessResponse } from 'src/core/utils/response';
import { SuccessResponseType } from 'src/core/utils/response.type';
import { createStoreDTO, shopDetailDto } from './dto/shop';

import {
  getFieldValues,
  getMyVendorsFieldValues,
  makeMyProductsResponse,
  validateArray,
  validateStoreInput,
} from './Shop.utils';
import {
  deleteBulkMediaHandler,
  deleteBulkProductHandler,
  getMyProductsHandler,
  getShopProductsHandler,
  updateMyProductHandler,
} from 'src/graphql/handlers/product';
import {
  myProductsDTO,
  removeMyProductsDto,
  updateMyProductDTO,
} from './dto/myProducts';
import { provisionStoreFront } from 'src/external/endpoints/provisionStorefront';
import { B2C_DEVELOPMENT_TOKEN, B2C_STOREFRONT_TLD } from 'src/constants';
import { removeB2cProductMapping } from 'src/external/endpoints/b2cMapping';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';
import { getShopProductIds, isEmptyArray } from '../product/Product.utils';
import { shopInfoDto } from '../orders/dto';
@Injectable()
export class ShopService {
  private readonly logger = new Logger(ShopService.name);

  /**
   * @description -- this method creates a new storefront in b2c against a b2b shop
   * @pre_condition -- you should provide valid create shop input
   * @post_condition -- it creates a new store in b2c database, provisions a new storefront using github actions and adds store
   * information against b2b shop as well
   */
  public async createStore(
    shopId: string,
    storeInput: createStoreDTO,
    token: string,
  ): Promise<any> {
    try {
      const storeUrl = this.generateStorefrontUrl(storeInput.name);
      storeInput.url = storeUrl;
      const [createStore, shopDetails] = await Promise.all([
        createStoreHandler(
          validateStoreInput(storeInput),
          B2C_DEVELOPMENT_TOKEN,
          true,
        ),
        getShopDetailsV2Handler({ id: shopId }),
      ]);
      await Promise.all([
        addStoreToShopHandler(createStore, shopDetails, token),
        provisionStoreFront(storeInput.url),
      ]);
      return prepareSuccessResponse(
        createStore,
        'new storefront provisioned',
        201,
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async getShopDetailsV2(
    filter: shopDetailDto,
    isb2c = false,
  ): Promise<object> {
    try {
      const response = await getShopDetailsV2Handler(filter, isb2c);
      return prepareSuccessResponse(response);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
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

  public async getMyProducts(retailerId: string, filter: myProductsDTO) {
    try {
      let productIds: string[] = [];
      const retailer = await getShopDetailsV2Handler({ id: retailerId });
      const storefrontIds = getFieldValues(retailer['fields'], 'storefrontids');
      const B2C_API = true;
      let storeDetails;
      await Promise.all(
        (storefrontIds || []).map(async (storeId) => {
          const pagination = filter as PaginationDto;
          const shopProducts = await getShopProductsHandler(
            {
              ...pagination,
              storeId,
            },
            B2C_API,
          );
          storeDetails = shopProducts;
          const shopProductIds = getShopProductIds(shopProducts);
          productIds = productIds.concat(shopProductIds);
        }),
      );
      if (isEmptyArray(productIds)) {
        const productsList = makeMyProductsResponse(
          await getMyProductsHandler(productIds, { first: 10 }),
          storeDetails,
        );
        return prepareSuccessResponse([retailer, productsList]);
      }
      return prepareSuccessResponse(
        [retailer, []],
        'no products exists against given shop id',
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
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

  public async removeProductsFromMyProducts(input: removeMyProductsDto, token) {
    try {
      const productIds = input.productIds;
      const storeId = input.storeId;
      const isB2c = true;
      const [saleor, mapping, multiVendor] = await Promise.all([
        deleteBulkProductHandler(productIds, token, isB2c),
        removeB2cProductMapping(productIds),
        removeProductsFromShopHandler(productIds, storeId, token, isB2c),
      ]);
      return prepareSuccessResponse({ saleor, mapping, multiVendor });
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
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

  public async updateMyProduct(
    updateMyProduct: updateMyProductDTO,
    token: string,
  ) {
    try {
      const mediaUpdate = await deleteBulkMediaHandler(
        updateMyProduct.removeMediaIds,
        token,
        true,
      );
      const response = await updateMyProductHandler(
        updateMyProduct,
        token,
        true,
      );
      return prepareSuccessResponse({ response, mediaUpdate }, '', 200);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async addVendorsToShop(
    shopId: string,
    vendorIds: number[],
    token: string,
  ): Promise<SuccessResponseType> {
    try {
      // getting shop details by given shop id
      const shopDetail = await getShopDetailsV2Handler({ id: shopId });
      // Adding vendorIds against given shop
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

  public async removeMyVendorsToShop(
    shopId: string,
    vendorIds: number[],
    token: string,
  ): Promise<SuccessResponseType> {
    try {
      // getting shop details by given shop id
      const shopDetail = await getShopDetailsV2Handler({ id: shopId });
      // Adding vendorIds against given shop
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

  public async getMyVendors(shopId: string): Promise<SuccessResponseType> {
    try {
      const response = [];
      // getting shop details by given shop id
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

  public async getShopIdByProductIds(productIds) {
    try {
      const ids = validateArray(productIds);
      let response = [];
      await Promise.all(
        ids.map(async (productId) => {
          const shopId = await shopIdByProductIdHandler(productId);
          response = [...response, shopId];
        }),
      );
      return prepareSuccessResponse(response, '', 200);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async getAllShops(quantity: number) {
    try {
      const response = await getAllShopsHandler(quantity);
      return prepareSuccessResponse(response, '', 200);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async createMarketplaceShop(
    shopInput: createStoreDTO,
    token: string,
    isB2c = false,
  ): Promise<SuccessResponseType> {
    try {
      const response = await createStoreHandler(
        validateStoreInput(shopInput),
        token,
        isB2c,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public generateStorefrontUrl(storeName: string) {
    try {
      const validateStoreName = storeName.replace(/[\s.]+/g, '').toLowerCase();
      const url = `${validateStoreName}${B2C_STOREFRONT_TLD}`;
      return url;
    } catch (error) {
      this.logger.error(error);
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
}
