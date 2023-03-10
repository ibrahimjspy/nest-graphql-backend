import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import { updateCheckoutBundleState } from 'src/graphql/handlers/checkout/checkout';
import { CheckoutBundleInputType } from 'src/graphql/handlers/checkout.type';
import { UpdateBundleStateDto } from '../dto/add-bundle.dto';
import { SaleorCartService } from './services/saleor/Cart.saleor.service';
import { MarketplaceCartService } from './services/marketplace/Cart.marketplace.service';
import {
  getBundlesFromCheckout,
  getCheckoutBundleIds,
  getNewBundlesToAdd,
} from './Cart.utils';
import { CartResponseService } from './services/Response.service';
import {
  CheckoutIdError,
  SelectBundleError,
  UnSelectBundleError,
} from '../Checkout.errors';
import { ReplaceBundleDto } from './dto/cart';
import { CartValidationService } from './services/Validation.service';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);
  constructor(
    private saleorService: SaleorCartService,
    private marketplaceService: MarketplaceCartService,
    private cartResponseBuilder: CartResponseService,
    private cartValidationService: CartValidationService,
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
    updatedCheckoutBundles,
    token: string,
  ): Promise<object> {
    try {
      const checkoutBundleIds = getCheckoutBundleIds(updatedCheckoutBundles);
      const { checkoutBundlesData, checkoutId } =
        await this.marketplaceService.getCheckoutBundlesByIds(
          userEmail,
          checkoutBundleIds,
          token,
        );
      const [saleor, marketplace] = await Promise.all([
        this.saleorService.updateBundleLines(
          checkoutId,
          checkoutBundlesData,
          updatedCheckoutBundles,
          token,
        ),
        this.marketplaceService.updateBundles(
          userEmail,
          updatedCheckoutBundles,
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
      if (error instanceof CheckoutIdError) {
        return prepareFailedResponse(error.message);
      }
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
      if (error instanceof CheckoutIdError) {
        return prepareFailedResponse(error.message);
      }
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
      const action = false;
      const { checkoutId, checkoutBundlesData } =
        await this.marketplaceService.getCheckoutBundlesByIds(
          userEmail,
          checkoutBundleIds,
          token,
        );
      await this.cartValidationService.validateUnSelectBundles(
        checkoutBundlesData,
      );
      const [saleor, marketplace] = await Promise.allSettled([
        this.saleorService.removeBundleLines(
          checkoutId,
          checkoutBundlesData,
          token,
        ),
        updateCheckoutBundleState(action, updateBundleState, token),
      ]);
      return await this.cartResponseBuilder.unselectBundles(
        saleor,
        marketplace,
        updateBundleState,
        token,
      );
    } catch (error) {
      this.logger.error(error);
      if (
        error instanceof CheckoutIdError ||
        error instanceof UnSelectBundleError
      ) {
        return prepareFailedResponse(error.message);
      }
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
      const action = true;
      const { checkoutId, checkoutBundlesData } =
        await this.marketplaceService.getCheckoutBundlesByIds(
          userEmail,
          checkoutBundleIds,
          token,
        );
      await this.cartValidationService.validateSelectBundles(
        checkoutBundlesData,
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
      return await this.cartResponseBuilder.selectBundles(
        saleor,
        marketplace,
        updateBundleState,
        token,
      );
    } catch (error) {
      this.logger.error(error);
      if (
        error instanceof CheckoutIdError ||
        error instanceof SelectBundleError
      ) {
        return prepareFailedResponse(error.message);
      }
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- this method replaces existing checkout bundle with another bundle
   */
  public async replaceCheckoutBundle(
    replaceBundleData: ReplaceBundleDto,
    token: string,
  ) {
    try {
      const { checkoutBundleId, newBundleId, userEmail } = replaceBundleData;
      const { checkoutId, checkoutBundlesData } =
        await this.marketplaceService.getCheckoutBundlesByIds(
          userEmail,
          [checkoutBundleId],
          token,
        );
      const newBundles = getNewBundlesToAdd(checkoutBundlesData, newBundleId);
      const [deletePreviousBundle, createNewBundle] = await Promise.allSettled([
        await this.deleteBundlesFromCart(userEmail, [checkoutBundleId], token),
        this.addBundlesToCart(userEmail, checkoutId, newBundles, token),
      ]);
      return await this.cartResponseBuilder.replaceCheckoutBundle(
        deletePreviousBundle,
        createNewBundle,
        { checkoutBundlesData, userEmail, checkoutId, newBundleId },
        token,
      );
    } catch (error) {
      this.logger.error(error);
      if (error instanceof CheckoutIdError) {
        return prepareFailedResponse(error.message);
      }
      return graphqlExceptionHandler(error);
    }
  }
}
