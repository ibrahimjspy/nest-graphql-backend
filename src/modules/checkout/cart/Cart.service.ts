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
  getBundleCheckoutId,
  getBundleIdFromBundleCreate,
  getBundlesFromCheckout,
  getCheckoutBundleIds,
  getNewBundlesToAdd,
  getSelectedCheckoutBundles,
  getUnSelectedCheckoutBundles,
  getUpdateMarketplaceCheckoutBundles,
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
   * Adds shopping cart bundles for the given user.
   * If a checkout ID is provided, it runs the saleorService.addBundleLines and marketplaceService.addBundles in parallel.
   * If no checkout ID is provided, it awaits the marketplaceService.addBundles.
   * checkout id is resolved based on vendor fulfillment type
   *
   * @param userEmail - The email of the user.
   * @param checkoutId - The ID of the checkout.
   * @param bundlesList - The list of bundles to add to the cart.
   * @param token - The authentication token.
   * @returns A promise that resolves to a SuccessResponseType.
   */
  public async addBundlesToCart(
    userEmail: string,
    bundlesList: CheckoutBundleInputType[],
    token: string,
  ): Promise<SuccessResponseType> {
    try {
      this.logger.log('Adding bundles to cart', bundlesList);
      const [marketplaceResult] = await Promise.allSettled([
        this.marketplaceService.addBundles(userEmail, bundlesList, token),
      ]);

      const checkoutId = getBundleCheckoutId(
        marketplaceResult['value'],
        bundlesList,
      );
      this.logger.log('Adding items to cart against checkout id', checkoutId);

      const [saleorResult] = await Promise.allSettled([
        this.saleorService.addBundleLines(
          userEmail,
          checkoutId,
          bundlesList,
          token,
        ),
      ]);

      await this.marketplaceService.addCheckoutIdToMarketplace(
        userEmail,
        getUpdateMarketplaceCheckoutBundles(
          bundlesList,
          saleorResult['value'].id,
        ),
        token,
      );

      return await this.cartResponseBuilder.addBundlesToCart(
        saleorResult,
        marketplaceResult,
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
        await this.cartSessionReset(userEmail, token);
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
      const { checkoutId, checkoutBundlesData, isMultiCheckout } =
        await this.marketplaceService.getCheckoutBundlesByIds(
          userEmail,
          checkoutBundleIds,
          token,
        );
      // TODO fix this to handle checkout bundles separately
      if (isMultiCheckout) return await this.cartSessionReset(userEmail, token); // in case of multi checkout we remove cart session
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
        await this.cartSessionReset(userEmail, token);
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
        this.addBundlesToCart(userEmail, newBundles, token),
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
        await this.cartSessionReset(replaceBundleData.userEmail, token);
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
        checkoutIds: [checkoutId],
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
      this.logger.log('Adding open packs to cart', addOpenPackToCart.bundles);
      const { userEmail, checkoutId, bundles } = addOpenPackToCart;
      const bundlesResponse = [];

      // Retrieve all checkout bundles from the marketplace service
      const marketplaceCheckout =
        (await this.marketplaceService.getAllCheckoutBundles({
          userEmail,
          token,
          productDetails: false,
        })) as CartResponseInterface;

      // Validate and process the open pack creation
      const { openBundlesCreate, updatedOpenPack } = validateOpenPackCreate(
        marketplaceCheckout.data.checkoutBundles,
        bundles,
        checkoutId,
      );

      this.logger.log('following bundles are needed to create or update', {
        openBundlesCreate,
        updatedOpenPack,
      });

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
          updatedOpenPack.map(
            async (updateOpenPack) =>
              await this.updateOpenPack(updateOpenPack, token, false),
          ),
        );
      }

      const createOpenBundles = [];
      if (isEmptyArray(openBundlesCreate)) {
        // Create new open packs
        const createNewBundle = await this.addBundlesToCart(
          userEmail,
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
    validate = false,
  ): Promise<object> {
    try {
      let updateOpenPackPayload = updateOpenPack;
      this.logger.log(
        `Updating open pack ${updateOpenPack.bundleId}`,
        updateOpenPack.variants,
      );
      if (validate) {
        // Validate and process the open pack update
        const { checkoutId } = updateOpenPack;
        const marketplaceCheckout =
          (await this.marketplaceService.getAllCheckoutBundles({
            checkoutIds: [checkoutId],
            token,
            productDetails: false,
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

        this.logger.log('Open pack update validation', {
          allReadyExists,
          deleteCheckoutBundles,
          updatedOldVariantsPack,
        });

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

      // Perform the update in Saleor and retrieve updated data
      const saleor = await this.saleorService.handleOpenPackUpdates(
        updateOpenPackPayload,
        token,
      );
      const [updateBundle, marketplace] = await Promise.all([
        await this.productService.updateBundle(updateOpenPackPayload),
        this.marketplaceService.getAllCheckoutBundles({
          userEmail: saleor.user.email,
          token,
        }),
      ]);

      this.logger.log('Open pack updated', updateBundle);

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

  /**
   * @description -- this method resets cart to empty state
   * @warn -- this method is not recommended to use unless absolutely necessary
   */
  public async cartSessionReset(userEmail: string, token: string) {
    try {
      this.logger.log('Resetting cart against user email');
      const checkoutResponse =
        (await this.marketplaceService.getAllCheckoutBundles({
          userEmail,
          token,
          productDetails: false,
        })) as CartResponseInterface;
      const checkoutBundleIds = getCheckoutBundleIds(
        checkoutResponse.data.checkoutBundles,
      );
      const deleteCheckoutBundles = await this.marketplaceService.deleteBundles(
        userEmail,
        checkoutBundleIds,
        token,
        true,
      );
      return prepareSuccessResponse({ marketplace: deleteCheckoutBundles });
    } catch (error) {
      this.logger.error(error);
      return prepareCheckoutFailedResponse(
        'resetting cart state failed',
        400,
        error,
      );
    }
  }
}
