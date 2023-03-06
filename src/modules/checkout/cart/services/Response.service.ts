import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { CartRollbackService } from './Rollback.service';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import { responseStatusValidate } from '../Cart.utils';

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

      if (status == 'SALEOR_FAILED') {
        await this.cartRollbackService.addCheckoutBundleLinesSaleor(
          marketplace,
          userBundles,
          token,
        );
        return prepareFailedResponse(
          'Adding bundle lines to Saleor failed',
          500,
          saleor,
        );
      }
      return prepareFailedResponse('Adding bundles to cart failed', 500);
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
          500,
          saleor,
        );
      }
      return prepareFailedResponse('deleting bundles from cart failed', 500);
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
          500,
          saleor,
        );
      }
      return prepareFailedResponse('updating cart bundles state failed', 500);
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
          500,
          saleor,
        );
      }
      return prepareFailedResponse('updating cart bundles state failed', 500);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
