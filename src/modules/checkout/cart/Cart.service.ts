import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareSuccessResponse } from 'src/core/utils/response';
import { updateCheckoutBundleState } from 'src/graphql/handlers/checkout/checkout';
import { CheckoutBundleInputType } from 'src/graphql/handlers/checkout.type';
import { UpdateBundleStateDto } from '../dto/add-bundle.dto';
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
   * @description -- fetches shopping cart data from bundle service against userEmail
   */
  public async addBundlesToCart(
    userEmail: string,
    checkoutId: string,
    bundlesList: CheckoutBundleInputType[],
    token: string,
  ): Promise<object> {
    try {
      const [saleor, marketplace] = await Promise.all([
        this.saleorService.addBundleLines(
          userEmail,
          checkoutId,
          bundlesList,
          token,
        ),
        this.marketplaceService.addBundles(userEmail, bundlesList, token),
      ]);
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

  /**
   * @description -- fetches shopping cart data from bundle service against userEmail
   */
  public async updateBundlesFromCart(
    userEmail: string,
    checkoutBundles,
    token: string,
  ): Promise<object> {
    try {
      const [saleor, marketplace] = await Promise.all([
        this.saleorService.updateBundleLines(userEmail, checkoutBundles, token),
        this.marketplaceService.updateBundles(
          userEmail,
          checkoutBundles,
          token,
        ),
      ]);
      return prepareSuccessResponse(
        { saleor, marketplace },
        'bundles updated from cart',
        201,
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async deleteBundlesFromCart(
    userEmail: string,
    checkoutBundleIds: string[],
    token: string,
  ): Promise<object> {
    try {
      const [saleor, marketplace] = await Promise.all([
        this.saleorService.removeBundleLines(
          userEmail,
          checkoutBundleIds,
          token,
        ),
        this.marketplaceService.deleteBundles(
          userEmail,
          checkoutBundleIds,
          token,
        ),
      ]);
      return prepareSuccessResponse(
        { saleor, marketplace },
        'bundles deleted from cart',
        201,
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- this method updates state of given list of checkout bundles
   * @satisfies -- it updates status in form of ~~ selected -- unselected
   */
  public async selectBundlesAsUnselected(
    updateBundleState: UpdateBundleStateDto,
    token: string,
  ) {
    try {
      const { userEmail, checkoutBundleIds } = updateBundleState;

      const [saleor, marketplace] = await Promise.all([
        this.saleorService.removeBundleLines(
          userEmail,
          checkoutBundleIds,
          token,
        ),
        await updateCheckoutBundleState(updateBundleState, token),
      ]);
      return prepareSuccessResponse(
        { saleor, marketplace },
        'bundles state updated in cart',
        201,
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
