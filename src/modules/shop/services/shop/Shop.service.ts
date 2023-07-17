import { Injectable, Logger } from '@nestjs/common';
import {
  addStoreToShopHandler,
  createStoreHandler,
  getAllShopsHandler,
  getShopBankDetailsHandler,
  getShopDetailsV2Handler,
  saveShopBankDetailsHandler,
  shopIdByOrderIdHandler,
  shopIdByProductIdHandler,
  updateStoreInfoHandler,
} from 'src/graphql/handlers/shop';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import { SuccessResponseType } from 'src/core/utils/response.type';
import { GetShopMapping, createStoreDTO, shopDetailDto } from '../../dto/shop';
import { validateArray, validateStoreInput } from '../../Shop.utils';
import { provisionStoreFrontV2 } from 'src/external/endpoints/provisionStorefront';
import { B2C_DEVELOPMENT_TOKEN, B2C_STOREFRONT_TLD } from 'src/constants';
import { shopInfoDto } from '../../../orders/dto';
import { ImportBulkCategoriesDto } from '../../dto/autoSync';
import { autoSyncHandler } from 'src/external/endpoints/autoSync';
import { NoBankAccountFoundError } from '../../Shop.exceptions';
import { workflowHandler } from 'src/external/endpoints/workflow';
import { createAuth0Connection } from 'src/external/endpoints/auth0';
import { getVendorMapping } from 'src/external/endpoints/vendorMappings';
@Injectable()
export class ShopService {
  private readonly logger = new Logger(ShopService.name);

  /**
   * @description -- this method creates a new storefront in b2c against a b2b shop
   * @pre_condition -- you should provide valid create shop input
   * @post_condition -- it creates a new store in b2c database, provisions a new storefront using github actions and adds store
   * information against b2b shop as well
   */
  public async createStoreV2(
    shopId: string,
    storeInput: createStoreDTO,
    token: string,
  ): Promise<any> {
    try {
      this.logger.log(`Creating store against shop id ${shopId}`, storeInput);
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
      const [workflowResponse] = await Promise.all([
        provisionStoreFrontV2(storeInput.url),
        addStoreToShopHandler(createStore, shopDetails, token),
        createAuth0Connection(createStore.id),
      ]);
      return prepareSuccessResponse(
        {
          createStore,
          workflowResponse,
        },
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

  public async getShopBankDetails(shopId: string, token: string) {
    try {
      const response = await getShopBankDetailsHandler(shopId, token);
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
      this.logger.log('Creating marketplace shop', shopInput);
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
      this.logger.log(`Updating store info ${shopId}`, storeDetails);
      const B2C_ENABLED = true;
      return prepareSuccessResponse(
        await updateStoreInfoHandler(shopId, storeDetails, token, B2C_ENABLED),
      );
    } catch (error) {
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * validates if shop has bank details saved
   * @warn throws error if no shop bank account is saved
   */
  public async validateShopBank(shopId: string, token: string) {
    const bankDetails = await getShopBankDetailsHandler(shopId, token);
    const accountReferenceId = bankDetails.accReferId;
    if (!accountReferenceId) {
      throw new NoBankAccountFoundError();
    }
  }

  /**
   * validates if shop has bank details saved and runs auto sync
   */
  public async autoSync(autoSyncInput: ImportBulkCategoriesDto, token: string) {
    try {
      this.logger.log('Calling auto sync', autoSyncInput);
      const { shopId } = autoSyncInput;
      await this.validateShopBank(shopId, token);
      const response = await autoSyncHandler(autoSyncInput);
      this.logger.log('auto sync message sent', response);

      return prepareSuccessResponse(
        response,
        'category auto sync message sent',
        201,
      );
    } catch (error) {
      this.logger.error(error);
      return prepareFailedResponse(error.message);
    }
  }

  /**
   * return workflow status against workflow name
   */
  public async getWorkflowStatus(workflowName: string) {
    try {
      const workflowStatus = await workflowHandler(workflowName);
      return prepareSuccessResponse(workflowStatus);
    } catch (error) {
      this.logger.error(error);
      return prepareFailedResponse(error.message);
    }
  }

  /**
   * return vendor mappings from elastic search
   */
  public async getVendorMappings(vendorMappingFilters: GetShopMapping) {
    try {
      const response = await getVendorMapping(vendorMappingFilters);
      return prepareSuccessResponse(response);
    } catch (error) {
      this.logger.error(error);
      return prepareFailedResponse(error.message);
    }
  }
}
