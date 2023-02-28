import { Injectable, Logger } from '@nestjs/common';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import { updateCheckoutBundleState } from 'src/graphql/handlers/checkout/checkout';
import { CheckoutBundleInputType } from 'src/graphql/handlers/checkout.type';
import { UpdateBundleStateDto } from '../dto/add-bundle.dto';
import {
  getCheckoutLineItems,
  getDeleteBundlesLines,
  getLinesFromBundles,
  getTargetBundleByCheckoutBundleId,
} from './Cart.utils';
import { SaleorCartService } from './services/saleor/Cart.saleor.service';
import { MarketplaceCartService } from './services/marketplace/Cart.marketplace.service';
import { SaleorCheckoutService } from '../services/Checkout.saleor';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);
  constructor(
    private saleorService: SaleorCartService,
    private marketplaceService: MarketplaceCartService,
    private saleorCheckoutService: SaleorCheckoutService,
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
        marketplaceResponse.checkoutBundles,
      );
      const checkoutId = marketplaceResponse.checkoutId;
      if (!checkoutId) {
        const createCheckout = await this.saleorCheckoutService.createCheckout(
          userEmail,
          checkoutLines,
          token,
        );
        await this.marketplaceService.addCheckoutIdToMarketplace(
          userEmail,
          token,
          createCheckout['id'],
        );
        return prepareSuccessResponse(
          { marketplaceResponse, createCheckout },
          'Created new checkout and added bundles to cart',
          201,
        );
      }
      const saleorResponse = await this.saleorService.addLines(
        checkoutId,
        checkoutLines,
        token,
      );
      return prepareSuccessResponse(
        { marketplaceResponse, saleorResponse },
        'added bundles to cart',
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
   * @description -- updates bundle quantity in cart against a user email
   */
  public async updateBundleFromCart(
    userEmail: string,
    checkoutBundles,
    token: string,
  ): Promise<object> {
    try {
      const marketplaceResponse = await this.marketplaceService.updateBundles(
        userEmail,
        checkoutBundles,
        token,
      );
      const checkoutId =
        marketplaceResponse['checkoutId'] ||
        'Q2hlY2tvdXQ6OGQ5Zjg1YTgtNDJkZi00YTBiLTk1MzItZDZjMzJlNDhjMDNh';
      const saleorCheckout = await this.saleorCheckoutService.getCheckout(
        checkoutId,
        token,
      );
      const checkoutLines = getCheckoutLineItems(
        saleorCheckout['lines'],
        marketplaceResponse['checkoutBundles'],
        checkoutBundles,
      );
      const saleorResponse = await this.saleorService.updateLines(
        checkoutId,
        checkoutLines,
        token,
      );
      return prepareSuccessResponse(
        { ...marketplaceResponse, ...saleorResponse },
        '',
        201,
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- deletes bundle and cart lines against given checkout bundle ids
   */
  public async deleteBundlesFromCart(
    userEmail: string,
    checkoutBundleIds: string[],
    token: string,
  ): Promise<object> {
    try {
      const marketplaceCheckout: any =
        await this.marketplaceService.getCheckoutBundles(userEmail, token);
      const saleorCheckout: any = await this.saleorCheckoutService.getCheckout(
        marketplaceCheckout.data.checkoutId,
        token,
      );
      const checkoutBundlesData = getTargetBundleByCheckoutBundleId(
        marketplaceCheckout['data']['checkoutBundles'],
        checkoutBundleIds,
      );
      const updatedSaleorLines = getDeleteBundlesLines(
        saleorCheckout.lines,
        checkoutBundlesData,
      );
      const [saleorResponse, marketplaceResponse] = await Promise.all([
        this.saleorService.updateLines(
          marketplaceCheckout.data.checkoutId,
          updatedSaleorLines,
          token,
        ),
        this.marketplaceService.deleteBundles(
          userEmail,
          checkoutBundleIds,
          token,
        ),
      ]);
      return prepareSuccessResponse({ saleorResponse, marketplaceResponse });
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
