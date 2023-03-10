import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { CartRollbackService } from './Rollback.service';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import {
  replaceBundleStatusValidate,
  responseStatusValidate,
} from './Response.utils';

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
      if (status == 'SUCCESS') {
        return prepareSuccessResponse(
          { saleor, marketplace },
          'bundles added to cart',
          201,
        );
      }

      if (status == 'MARKETPLACE_FAILED') {
        await this.cartRollbackService.addCheckoutBundlesMarketplace(
          saleor,
          userBundles,
          token,
        );
        return prepareFailedResponse(
          'Adding bundle lines to Marketplace failed',
          400,
          saleor,
        );
      }

      if (status == 'SALEOR_FAILED') {
        await this.cartRollbackService.addCheckoutBundleLinesSaleor(
          marketplace,
          userBundles,
          token,
        );
        return prepareFailedResponse(
          'Adding bundle lines to Saleor failed',
          400,
          saleor,
        );
      }
      return prepareFailedResponse('Adding bundles to cart failed', 400);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async deleteBundlesFromCart(
    saleorResponse,
    marketplaceResponse,
    { checkoutBundlesData, userEmail },
    token: string,
  ) {
    try {
      const status = responseStatusValidate(
        saleorResponse,
        marketplaceResponse,
      );
      const saleor = saleorResponse.value;
      const marketplace = marketplaceResponse.value;
      if (status == 'SUCCESS') {
        return prepareSuccessResponse(
          { saleor, marketplace },
          'bundles deleted from cart',
          201,
        );
      }

      if (status == 'SALEOR_FAILED') {
        await this.cartRollbackService.deleteCheckoutBundleLinesSaleor(
          { checkoutBundlesData, userEmail },
          token,
        );
        return prepareFailedResponse(
          'deleting bundle lines from Saleor failed',
          400,
          saleor,
        );
      }
      return prepareFailedResponse('deleting bundles from cart failed', 400);
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
      if (status == 'SUCCESS') {
        return prepareSuccessResponse(
          { saleor, marketplace },
          'bundles state updated to select',
          201,
        );
      }

      if (status == 'SALEOR_FAILED') {
        await this.cartRollbackService.selectBundlesSaleor(
          checkoutBundleIds,
          userEmail,
          token,
        );
        return prepareFailedResponse(
          'updating cart state in Saleor failed',
          400,
          saleor,
        );
      }
      return prepareFailedResponse('updating cart bundles state failed', 400);
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
      if (status == 'SUCCESS') {
        return prepareSuccessResponse(
          { saleor, marketplace },
          'bundles state updated to un-select',
          201,
        );
      }

      if (status == 'SALEOR_FAILED') {
        await this.cartRollbackService.unselectBundlesSaleor(
          checkoutBundleIds,
          userEmail,
          token,
        );
        return prepareFailedResponse(
          'updating cart state in Saleor failed',
          400,
          saleor,
        );
      }
      return prepareFailedResponse('updating cart bundles state failed', 400);
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
      if (status == 'SUCCESS') {
        return prepareSuccessResponse(
          { createBundle },
          'checkout bundle is replaced',
          201,
        );
      }
      if (status == 'PREVIOUS_BUNDLE_DELETION_FAILED') {
        await this.cartRollbackService.replaceBundleDelete(
          createBundle,
          newBundleId,
          token,
        );
        return prepareFailedResponse('deleting old bundle failed', 400);
      }
      if (status == 'NEW_BUNDLE_CREATION_FAILED') {
        await this.cartRollbackService.replaceBundleCreate(
          userEmail,
          checkoutId,
          checkoutBundlesData,
          token,
        );
        return prepareFailedResponse('creating new bundle failed', 400);
      }
      return prepareFailedResponse('replacing bundle failed', 400);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
