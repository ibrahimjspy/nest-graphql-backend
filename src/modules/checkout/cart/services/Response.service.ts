import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { CartRollbackService } from './Rollback.service';
import {
  prepareCheckoutFailedResponse,
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import {
  replaceBundleStatusValidate,
  responseStatusValidate,
} from './Response.utils';
import {
  ReplaceBundleStatusEnum,
  ResponseStatusEnum,
} from './Response.utils.type';
import { isEmptyArray } from 'src/modules/product/Product.utils';
const { SUCCESS, SALEOR_FAILED, MARKETPLACE_FAILED } = ResponseStatusEnum;
const {
  REPLACED,
  PREVIOUS_BUNDLE_DELETION_FAILED,
  NEW_BUNDLE_CREATION_FAILED,
} = ReplaceBundleStatusEnum;
@Injectable()
export class CartResponseService {
  private readonly logger = new Logger(CartResponseService.name);

  constructor(private cartRollbackService: CartRollbackService) {}

  public async addBundlesToCart(
    saleorResponse,
    marketplaceResponse,
    userBundles,
    token: string,
  ) {
    try {
      const status = responseStatusValidate(
        saleorResponse,
        marketplaceResponse,
      );
      const saleor = saleorResponse.value;
      const marketplace = marketplaceResponse.value;
      const saleorErrors = saleorResponse?.reason?.response?.errors;
      const marketplaceErrors = marketplaceResponse?.reason;

      if (status == SUCCESS) {
        return prepareSuccessResponse(
          { saleor, marketplace },
          'bundles added to cart',
          201,
        );
      }

      if (status == MARKETPLACE_FAILED) {
        await this.cartRollbackService.addCheckoutBundlesMarketplace(
          saleor,
          userBundles,
          token,
        );
        return prepareCheckoutFailedResponse(
          'Adding bundle to saleor failed',
          400,
          marketplaceErrors,
        );
      }

      if (status == SALEOR_FAILED) {
        await this.cartRollbackService.addCheckoutBundleLinesSaleor(
          marketplace,
          userBundles,
          token,
        );
        return prepareCheckoutFailedResponse(
          'Adding bundle lines to Saleor failed',
          400,
          saleorErrors,
        );
      }
      return prepareCheckoutFailedResponse(
        'Adding bundles to cart failed =',
        400,
        [marketplaceErrors, saleorErrors],
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async deleteBundlesFromCart(
    saleorResponse,
    marketplaceResponse,
    { checkoutBundlesData, userEmail, checkoutId },
    token: string,
  ) {
    try {
      const status = responseStatusValidate(
        saleorResponse,
        marketplaceResponse,
      );
      const saleor = saleorResponse.value;
      const marketplace = marketplaceResponse.value;
      const saleorErrors = saleorResponse?.reason?.response?.errors;
      const marketplaceErrors = marketplaceResponse?.reason?.response?.errors;

      if (status == SUCCESS) {
        return prepareSuccessResponse(
          { saleor, marketplace },
          'bundles deleted from cart',
          201,
        );
      }

      if (status == SALEOR_FAILED) {
        await this.cartRollbackService.deleteCheckoutBundleLinesSaleor(
          { checkoutBundlesData, userEmail },
          token,
        );
        return prepareCheckoutFailedResponse(
          'deleting bundle lines from Saleor failed',
          400,
          saleorErrors,
        );
      }

      if (status == MARKETPLACE_FAILED) {
        await this.cartRollbackService.deleteCheckoutBundlesMarketplace(
          checkoutBundlesData,
          userEmail,
          checkoutId,
          token,
        );
        return prepareCheckoutFailedResponse(
          'deleting bundle lines from Marketplace failed',
          400,
          marketplaceErrors,
        );
      }
      return prepareCheckoutFailedResponse(
        'Deleting bundles from cart failed',
        400,
        [saleorErrors, ...marketplaceErrors],
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async selectBundles(
    saleorResponse,
    marketplaceResponse,
    { checkoutBundleIds, userEmail },
    token: string,
  ) {
    try {
      const status = responseStatusValidate(
        saleorResponse,
        marketplaceResponse,
      );
      const saleor = saleorResponse.value;
      const marketplace = marketplaceResponse.value;
      const saleorErrors = saleorResponse?.reason?.response?.errors;
      const marketplaceErrors = marketplaceResponse?.reason?.response?.errors;

      if (status == SUCCESS) {
        return prepareSuccessResponse(
          { saleor, marketplace },
          'bundles state updated to select',
          201,
        );
      }

      if (status == SALEOR_FAILED) {
        await this.cartRollbackService.selectBundlesSaleor(
          checkoutBundleIds,
          userEmail,
          token,
        );
        return prepareCheckoutFailedResponse(
          'updating cart state in Saleor failed',
          400,
          saleorErrors,
        );
      }
      return prepareCheckoutFailedResponse(
        'updating cart bundles state failed',
        400,
        [...saleorErrors, ...marketplaceErrors],
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async unselectBundles(
    saleorResponse,
    marketplaceResponse,
    { checkoutBundleIds, userEmail },
    token: string,
  ) {
    try {
      const status = responseStatusValidate(
        saleorResponse,
        marketplaceResponse,
      );
      const saleor = saleorResponse.value;
      const marketplace = marketplaceResponse.value;
      const saleorErrors = saleorResponse?.reason?.response?.errors;
      const marketplaceErrors = marketplaceResponse?.reason?.response?.errors;

      if (status == SUCCESS) {
        return prepareSuccessResponse(
          { saleor, marketplace },
          'bundles state updated to un-select',
          201,
        );
      }

      if (status == SALEOR_FAILED) {
        await this.cartRollbackService.unselectBundlesSaleor(
          checkoutBundleIds,
          userEmail,
          token,
        );
        return prepareCheckoutFailedResponse(
          'updating cart state in Saleor failed',
          400,
          saleorErrors,
        );
      }
      return prepareCheckoutFailedResponse(
        'updating cart bundles state failed',
        400,
        [...marketplaceErrors, ...saleorErrors],
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async replaceCheckoutBundle(
    deletePreviousBundle,
    createNewBundle,
    { checkoutBundlesData, userEmail, checkoutId, newBundleId },
    token: string,
  ) {
    try {
      const status = replaceBundleStatusValidate(
        deletePreviousBundle.value,
        createNewBundle.value,
      );
      const createBundle = createNewBundle.value.data;

      if (status == REPLACED) {
        return prepareSuccessResponse(
          { createBundle },
          'checkout bundle is replaced',
          201,
        );
      }
      if (status == PREVIOUS_BUNDLE_DELETION_FAILED) {
        await this.cartRollbackService.replaceBundleDelete(
          createBundle,
          newBundleId,
          token,
        );
        return prepareCheckoutFailedResponse('deleting old bundle failed', 400);
      }
      if (status == NEW_BUNDLE_CREATION_FAILED) {
        await this.cartRollbackService.replaceBundleCreate(
          userEmail,
          checkoutId,
          checkoutBundlesData,
          token,
        );
        return prepareFailedResponse('creating new bundle failed', 400);
      }
      return prepareCheckoutFailedResponse('replacing bundle failed', 400);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async addToCartV2(saleor, marketplace) {
    try {
      return prepareSuccessResponse(
        { saleor, marketplace },
        'bundles added to cart',
        201,
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async updateOpenPack(
    saleor,
    updateBundleResponse,
    marketplaceResponse,
  ) {
    try {
      const updateBundle = updateBundleResponse.data;
      const marketplace = marketplaceResponse.data;

      return prepareSuccessResponse(
        { saleor, updateBundle, marketplace },
        'open pack updated',
        201,
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async addOpenPackToCart(createOpenBundles, updateOpenBundles) {
    try {
      if (isEmptyArray(createOpenBundles)) {
        return createOpenBundles[createOpenBundles.length - 1];
      }
      return updateOpenBundles[updateOpenBundles.length - 1];
    } catch (error) {
      this.logger.error(error);
      return prepareCheckoutFailedResponse(
        'Adding open pack to cart failed',
        400,
        error,
      );
    }
  }
}
