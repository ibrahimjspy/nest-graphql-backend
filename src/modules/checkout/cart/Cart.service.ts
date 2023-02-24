import { Injectable, Logger } from '@nestjs/common';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import {
  updateCartBundlesCheckoutIdHandler,
  updateCheckoutBundleState,
  updateCheckoutBundlesHandler,
} from 'src/graphql/handlers/checkout/checkout';
import { CheckoutBundleInputType } from 'src/graphql/handlers/checkout.type';
import { UpdateBundleStateDto } from '../dto/add-bundle.dto';
import { getLinesFromBundles } from './Cart.utils';
import { deleteCheckoutBundlesHandler } from 'src/graphql/handlers/checkout/cart/cart.marketplace';
import { SaleorCartService } from './services/saleor/Cart.saleor.service';
import { MarketplaceCheckoutService } from './services/marketplace/Cart.marketplace.service';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);
  constructor(
    private saleorService: SaleorCartService,
    private marketplaceService: MarketplaceCheckoutService,
  ) {}

  /**
   * @description -- fetches shopping cart data from bundle service against userEmail
   */
  public async getShoppingCartData(
    userEmail: string,
    token: string,
  ): Promise<object> {
    try {
      return await this.marketplaceService.getCheckoutBundles(userEmail, token);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- this method adds bundles to cart against a user id
   * @deprecated -- it has additional call to fetch bundle status which in future will be deprecated as this logic will move to shop service
   * @deprecated -- in future usage of both update bundles and add bundles will be deprecated as they are adding useless validation logic to add to cart
   */
  public async addToCart(
    userEmail: string,
    bundlesList: CheckoutBundleInputType[],
    token: string,
  ): Promise<object> {
    try {
      const marketplaceResponse = await this.marketplaceService.addBundles(
        userEmail,
        bundlesList,
        token,
      );
      const checkoutLines: any = getLinesFromBundles(
        marketplaceResponse.data.checkoutBundles,
      );
      const checkoutId =
        marketplaceResponse.data.checkoutId ||
        'Q2hlY2tvdXQ6NzA5YTI1ODYtMTAxYy00MDRjLWE3ZGQtMDg5MGQzZDMwNTgz';
      const saleorResponse = await this.saleorService.addLines(
        checkoutId,
        checkoutLines,
        token,
      );
      return prepareSuccessResponse(
        { marketplaceResponse, saleorResponse },
        '',
        201,
      );
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RecordNotFound) {
        return prepareFailedResponse(error.message);
      }
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- removes given bundles from cart against a user email
   */
  public async deleteBundleFromCart(
    userEmail: string,
    checkoutBundleIds: string[],
    token: string,
  ): Promise<object> {
    try {
      const marketplaceResponse: any = await deleteCheckoutBundlesHandler(
        checkoutBundleIds,
        userEmail,
        false,
        token,
      );
      return prepareSuccessResponse(marketplaceResponse, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- updates bundle quantity in cart against a user email
   */
  public async updateBundleFromCart(
    userEmail: string,
    checkoutBundles,
    token: string,
  ): Promise<object> {
    try {
      const marketplaceResponse = await updateCheckoutBundlesHandler(
        userEmail,
        checkoutBundles,
        token,
      );

      return prepareSuccessResponse(marketplaceResponse, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- this method adds checkout id against a user checkout bundle session made against a user email
   */
  public async addCheckoutIdToMarketplace(
    userEmail: string,
    token: string,
    checkoutId: string,
  ) {
    try {
      const response = await updateCartBundlesCheckoutIdHandler(
        userEmail,
        token,
        checkoutId,
      );

      return response;
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- this method updates state of given list of checkout bundles
   * @satisfies -- it updates status in form of ~~ selected -- unselected
   */
  public async updateCheckoutBundleState(
    updateBundleState: UpdateBundleStateDto,
    token: string,
  ) {
    try {
      const response = await updateCheckoutBundleState(
        updateBundleState,
        token,
      );
      return prepareSuccessResponse(response, '', 200);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
