import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareCheckoutFailedResponse,
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
  validateCheckoutVariantMedia,
  validateOpenPackCreate,
  validateOpenPackUpdate,
} from './Cart.utils';
import { CartResponseService } from './services/Response.service';
import {
  CheckoutIdError,
  SelectBundleError,
  UnSelectBundleError,
} from '../Checkout.errors';
import {
  AddOpenPackDTO,
  ReplaceBundleDto,
  UpdateOpenPackDto,
} from './dto/cart';
import { SuccessResponseType } from 'src/core/utils/response.type';
import { ProductService } from 'src/modules/product/Product.service';
import { CartResponseInterface } from './Cart.types';
import { isEmptyArray } from 'src/modules/product/Product.utils';

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
      const cartResponse = (await this.marketplaceService.getAllCheckoutBundles(
        {
          userEmail,
          token,
          productDetails,
          isSelected,
        },
      )) as CartResponseInterface;
      validateCheckoutVariantMedia(cartResponse.data.checkoutBundles);
      return cartResponse;
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
  ): Promise<SuccessResponseType> {
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
   * Adds an open pack to the cart.
   * @param addOpenPackToCart - The AddOpenPackDTO object containing the data for adding the open pack to the cart.
   * @param token - The authentication token.
   * @returns A Promise that resolves to an object representing the result of adding the open pack to the cart.
   */
  public async addOpenPackToCart(
    addOpenPackToCart: AddOpenPackDTO,
    token: string,
  ): Promise<object> {
    try {
      const { userEmail, checkoutId, bundles } = addOpenPackToCart;
      const bundlesResponse = [];

      // Retrieve all checkout bundles from the marketplace service
      const marketplaceCheckout =
        (await this.marketplaceService.getAllCheckoutBundles({
          userEmail,
          token,
        })) as CartResponseInterface;

      // Validate and process the open pack creation
      const { openBundlesCreate, updatedOpenPack } = validateOpenPackCreate(
        marketplaceCheckout.data.checkoutBundles,
        bundles,
        checkoutId,
      );

      console.dir({ openBundlesCreate, updatedOpenPack }, { depth: null });

      // Create new bundles and prepare checkout bundles
      const checkoutBundles = await Promise.all(
        openBundlesCreate.map(async (bundle) => {
          const bundleCreate = await this.productService.createBundle(bundle);
          bundlesResponse.push(bundleCreate.data);
          const checkoutBundle = {
            bundleId: getBundleIdFromBundleCreate(bundleCreate),
            quantity: 1,
          };
          return checkoutBundle;
        }),
      );

      let updatedOpenBundles;
      if (isEmptyArray(updatedOpenPack)) {
        // Update existing open packs
        updatedOpenBundles = await Promise.all(
          updatedOpenPack.map(async (updateOpenPack) => {
            return await this.updateOpenPack(updateOpenPack, token, false);
          }),
        );
      }

      const createOpenBundles = [];
      if (isEmptyArray(openBundlesCreate)) {
        // Create new open packs
        const createNewBundle = await this.addBundlesToCart(
          userEmail,
          checkoutId,
          checkoutBundles,
          token,
        );
        createOpenBundles.push(createNewBundle);
      }

      // Build and return the cart response
      return this.cartResponseBuilder.addOpenPackToCart(
        createOpenBundles,
        updatedOpenBundles,
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * Updates an open pack directly in the bundle service and maintains state in Saleor.
   * @param updateOpenPack - The UpdateOpenPackDto object containing the data for updating the open pack.
   * @param token - The authentication token.
   * @param validate - Optional. Specifies whether to perform validation. Defaults to true.
   * @returns A Promise that resolves to an object representing the result of the open pack update.
   */
  public async updateOpenPack(
    updateOpenPack: UpdateOpenPackDto,
    token: string,
    validate = true,
  ): Promise<object> {
    try {
      let updateOpenPackPayload = updateOpenPack;

      if (validate) {
        // Validate and process the open pack update
        const { checkoutId } = updateOpenPack;
        const marketplaceCheckout =
          (await this.marketplaceService.getAllCheckoutBundles({
            checkoutId,
            token,
          })) as CartResponseInterface;
        const userEmail = marketplaceCheckout.data.userEmail;

        // Validate the open pack update and handle existing open packs
        const {
          allReadyExists,
          deleteCheckoutBundles,
          updatedOldVariantsPack,
        } = validateOpenPackUpdate(
          marketplaceCheckout.data.checkoutBundles,
          updateOpenPack,
        );

        if (allReadyExists) {
          // Remove existing open packs
          await this.deleteBundlesFromCart(
            userEmail,
            deleteCheckoutBundles,
            token,
          );
          updateOpenPackPayload = updatedOldVariantsPack;
        }
      }

      const { checkoutId } = updateOpenPackPayload;

      // Perform the update in Saleor and retrieve updated data
      const saleor = await this.saleorService.handleOpenPackUpdates(
        updateOpenPackPayload,
        token,
      );
      const [updateBundle, marketplace] = await Promise.all([
        this.productService.updateBundle(updateOpenPackPayload),
        this.marketplaceService.getAllCheckoutBundles({ checkoutId, token }),
      ]);

      // Build and return the cart response
      return this.cartResponseBuilder.updateOpenPack(
        saleor,
        updateBundle,
        marketplace,
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- this method replaces existing checkout bundle with another bundle
   */
  public async replaceCheckoutBundleV2(
    replaceBundleData: ReplaceBundleDto,
    token: string,
  ) {
    try {
      this.logger.log('Replacing checkout bundles', replaceBundleData);
      const saleor = await this.saleorService.handleClosePackReplace(
        replaceBundleData,
        token,
      );
      const marketplace = await this.marketplaceService.replaceCheckoutBundle(
        replaceBundleData,
        token,
      );
      return prepareSuccessResponse(
        { saleor, marketplace },
        'checkout bundle replaced',
        201,
      );
    } catch (error) {
      this.logger.error(error);
      return prepareCheckoutFailedResponse(
        'replace checkout bundles failed',
        400,
        error,
      );
    }
  }
}
