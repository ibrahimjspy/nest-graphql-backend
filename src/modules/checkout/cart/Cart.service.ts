import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import { updateCheckoutBundleState } from 'src/graphql/handlers/checkout/checkout';
import { CheckoutBundleInputType } from 'src/graphql/handlers/checkout.type';
import { AddBundleDto, UpdateBundleStateDto } from '../dto/add-bundle.dto';
import { SaleorCartService } from './services/saleor/Cart.saleor.service';
import { MarketplaceCartService } from './services/marketplace/Cart.marketplace.service';
import {
  getBundleIdFromBundleCreate,
  getBundlesFromCheckout,
  getCheckoutBundleIds,
  getNewBundlesToAdd,
  getSelectedCheckoutBundles,
  getUnSelectedCheckoutBundles,
} from './Cart.utils';
import { CartResponseService } from './services/Response.service';
import {
  CheckoutIdError,
  SelectBundleError,
  UnSelectBundleError,
} from '../Checkout.errors';
import { AddOpenPackDTO, ReplaceBundleDto } from './dto/cart';
import { SuccessResponseType } from 'src/core/utils/response.type';
import { ProductService } from 'src/modules/product/Product.service';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);
  constructor(
    private saleorService: SaleorCartService,
    private marketplaceService: MarketplaceCartService,
    private cartResponseBuilder: CartResponseService,
    private productService: ProductService,
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
        { checkoutBundlesData, userEmail, checkoutId },
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
      const [saleor, marketplace] = await Promise.allSettled([
        this.saleorService.removeBundleLines(
          checkoutId,
          getSelectedCheckoutBundles(checkoutBundlesData),
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
      const throwCheckoutIdException = false;
      const { checkoutId, checkoutBundlesData } =
        await this.marketplaceService.getCheckoutBundlesByIds(
          userEmail,
          checkoutBundleIds,
          token,
          throwCheckoutIdException,
        );
      const bundlesList = getBundlesFromCheckout(
        getUnSelectedCheckoutBundles(checkoutBundlesData),
      );
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

  /**
   * @description -- fetches shopping cart data from bundle service against checkoutId
   */
  public async getCartV2(
    checkoutId: string,
    isSelected: boolean | null,
    token: string,
  ): Promise<object> {
    try {
      return await this.marketplaceService.getCheckoutBundlesV2({
        checkoutId,
        token,
        isSelected,
      });
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- fetches shopping cart data from bundle service against checkoutId
   */
  public async createCartSession(
    checkoutBundles: AddBundleDto,
    token: string,
  ): Promise<SuccessResponseType> {
    try {
      const { userEmail, bundles } = checkoutBundles;
      let { checkoutId } = checkoutBundles;
      const saleor = await this.saleorService.addBundleLines(
        userEmail,
        checkoutId,
        bundles,
        token,
      );
      checkoutId = saleor.id;
      const marketplace = await this.marketplaceService.addCheckoutBundlesV2(
        { userEmail, checkoutId, bundles },
        token,
      );
      return this.cartResponseBuilder.addToCartV2(saleor, marketplace);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- adds to cart against existing cart id
   * @pre_condition -- cart id should be valid and a cart session should be active against it
   */
  public async addToCartV2(
    checkoutBundles: AddBundleDto,
    token: string,
  ): Promise<SuccessResponseType> {
    try {
      const { userEmail, checkoutId, bundles } = checkoutBundles;

      const [saleor, marketplace] = await Promise.all([
        await this.saleorService.addBundleLines(
          userEmail,
          checkoutId,
          bundles,
          token,
        ),
        await this.marketplaceService.addCheckoutBundlesV2(
          { userEmail, checkoutId, bundles },
          token,
        ),
      ]);
      return this.cartResponseBuilder.addToCartV2(saleor, marketplace);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- creates a new bundle for open pack and adds to cart against existing cart id or userEmail
   * @pre_condition -- cart id should be valid and a cart session should be active against it
   */
  public async addOpenPackToCart(
    addOpenPackToCart: AddOpenPackDTO,
    token: string,
  ): Promise<object> {
    try {
      const { userEmail, checkoutId, bundles } = addOpenPackToCart;
      const [...checkoutBundles] = await Promise.all(
        bundles.map(async (bundle) => {
          const bundleCreate = await this.productService.createBundle(bundle);
          const checkoutBundle = {
            bundleId: getBundleIdFromBundleCreate(bundleCreate),
            quantity: 1,
          };
          return checkoutBundle;
        }),
      );
      return await this.addBundlesToCart(
        userEmail,
        checkoutId,
        checkoutBundles,
        token,
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
