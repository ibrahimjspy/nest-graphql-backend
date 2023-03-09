import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareSuccessResponse } from 'src/core/utils/response';
import { updateCheckoutBundleState } from 'src/graphql/handlers/checkout/checkout';
import { CheckoutBundleInputType } from 'src/graphql/handlers/checkout.type';
import { UpdateBundleStateDto } from '../dto/add-bundle.dto';
import { SaleorCartService } from './services/saleor/Cart.saleor.service';
import { MarketplaceCartService } from './services/marketplace/Cart.marketplace.service';
import { getBundlesFromCheckout } from './Cart.utils';
import { CartResponseService } from './services/Response.service';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);
  constructor(
    private saleorService: SaleorCartService,
    private marketplaceService: MarketplaceCartService,
    private cartResponseBuilder: CartResponseService,
  ) {}

  /**
   * @description -- fetches shopping cart data from bundle service against userEmail
   */
  public async getShoppingCartData(
    userEmail: string,
    token: string,
  ): Promise<object> {
    try {
      const isSelected = null;
      const productDetails = true;
      return await this.marketplaceService.getAllCheckoutBundles({
        userEmail,
        token,
        productDetails,
        isSelected,
      });
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
      const [saleor, marketplace] = await Promise.allSettled([
        this.saleorService.addBundleLines(
          userEmail,
          checkoutId,
          bundlesList,
          token,
        ),
        this.marketplaceService.addBundles(userEmail, bundlesList, token),
      ]);
      return await this.cartResponseBuilder.addBundlesToCart(
        saleor,
        marketplace,
        bundlesList,
        token,
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
      const { checkoutId, checkoutBundlesData } =
        await this.marketplaceService.getCheckoutBundlesByIds(
          userEmail,
          checkoutBundleIds,
          token,
        );
      const [saleor, marketplace] = await Promise.allSettled([
        this.saleorService.removeBundleLines(
          checkoutId,
          checkoutBundlesData,
          token,
        ),
        this.marketplaceService.deleteBundles(
          userEmail,
          checkoutBundleIds,
          token,
        ),
      ]);
      return this.cartResponseBuilder.deleteBundlesFromCart(
        saleor,
        marketplace,
        { checkoutBundlesData, userEmail },
        token,
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
      const action = 'un-select';
      const { checkoutId, checkoutBundlesData } =
        await this.marketplaceService.getCheckoutBundlesByIds(
          userEmail,
          checkoutBundleIds,
          token,
        );
      const [saleor, marketplace] = await Promise.allSettled([
        this.saleorService.removeBundleLines(
          checkoutId,
          checkoutBundlesData,
          token,
        ),
        await updateCheckoutBundleState(action, updateBundleState, token),
      ]);
      return this.cartResponseBuilder.unselectBundles(
        saleor,
        marketplace,
        updateBundleState,
        token,
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
  public async selectBundlesAsSelected(
    updateBundleState: UpdateBundleStateDto,
    token: string,
  ) {
    try {
      const { userEmail, checkoutBundleIds } = updateBundleState;
      const action = 'select';
      const { checkoutId, checkoutBundlesData } =
        await this.marketplaceService.getCheckoutBundlesByIds(
          userEmail,
          checkoutBundleIds,
          token,
        );
      const bundlesList = getBundlesFromCheckout(checkoutBundlesData);
      const [saleor, marketplace] = await Promise.allSettled([
        this.saleorService.addBundleLines(
          userEmail,
          checkoutId,
          bundlesList,
          token,
        ),
        updateCheckoutBundleState(action, updateBundleState, token),
      ]);
      return this.cartResponseBuilder.selectBundles(
        saleor,
        marketplace,
        updateBundleState,
        token,
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
