import { Injectable, Logger } from '@nestjs/common';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import {
  addBundlesHandler,
  addCheckoutBundlesHandler,
  addLinesHandler,
  checkoutHandler,
  deleteBundlesHandler,
  deleteLinesHandler,
  getCheckoutbundlesHandler,
  marketplaceCheckoutHandler,
  updateCartBundlesCheckoutIdHandler,
  updateCheckoutBundleState,
  updateCheckoutBundlesHandler,
  validateBundle,
} from 'src/graphql/handlers/checkout';
import { CheckoutBundleInputType } from 'src/graphql/handlers/checkout.type';
import {
  getBundleIds,
  getCheckoutLineIds,
  getCheckoutLineItems,
  getCheckoutLineItemsForDelete,
  getExistBundleIdsInList,
  getNotExistBundleIdsInList,
  selectOrUnselectBundle,
} from '../Checkout.utils';
import { UpdateBundleStateDto } from '../dto/add-bundle.dto';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  public async getShoppingCartData(
    userEmail: string,
    token: string,
  ): Promise<object> {
    try {
      const checkoutData = await getCheckoutbundlesHandler(userEmail, token);

      return prepareSuccessResponse(checkoutData);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  private async updateCartBundle(
    bundlesForCart: any,
    validateBundleList: [],
    userEmail: string,
    token: string,
  ) {
    const bundleList = await getExistBundleIdsInList(
      bundlesForCart,
      validateBundleList,
    );
    const updatedBundle = await updateCheckoutBundlesHandler(
      userEmail,
      bundleList,
      token,
    );
    return updatedBundle;
  }

  public async addToCart(
    userEmail: string,
    bundlesForCart: CheckoutBundleInputType[],
    token: string,
  ): Promise<object> {
    try {
      let response: object = {};
      const getBundleIdsArray = await getBundleIds(bundlesForCart);
      /* Mapping the bundleIds from the bundlesForCart array. */
      const validateBundleList = await validateBundle(
        userEmail,
        getBundleIdsArray,
        token,
      );
      /* The below code is checking if the bundleIdsExist in the cart or not. If it exists then it will
     update the bundle in the cart. If it does not exist then it will add the bundle in the cart. */
      if (validateBundleList['bundleIdsExist']['length'] > 0) {
        const updateBundleList = await this.updateCartBundle(
          bundlesForCart,
          validateBundleList,
          userEmail,
          token,
        );

        response = {
          ...response,
          updateBundleList,
        };
      }
      if (validateBundleList['bundleIdsNotExist']['length'] > 0) {
        const addBundleList = await this.addCartBundle(
          bundlesForCart,
          validateBundleList,
          userEmail,
          token,
        );
        response = {
          ...response,
          addedBundle: addBundleList,
        };
      }

      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RecordNotFound) {
        return prepareFailedResponse(error.message);
      }
      return graphqlExceptionHandler(error);
    }
  }

  private async addCartBundle(
    bundlesForCart: any,
    validateBundleList: [],
    userEmail: string,
    token: string,
  ) {
    const addbundleList = await getNotExistBundleIdsInList(
      bundlesForCart,
      validateBundleList,
    );
    const addedBundleList = await addCheckoutBundlesHandler(
      userEmail,
      addbundleList,
      token,
    );
    return addedBundleList;
  }

  public async deleteBundleFromCart(
    userEmail: string,
    checkoutBundleIds: string[],
    token: string,
  ): Promise<object> {
    try {
      const response = await deleteBundlesHandler(
        checkoutBundleIds,
        userEmail,
        false,
        token,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async updateBundleFromCart(
    userEmail: string,
    bundlesFromCart: object,
    token: string,
  ): Promise<object> {
    try {
      const UpdateBundle = [bundlesFromCart];
      const UpdateBundleresponse = await updateCheckoutBundlesHandler(
        userEmail,
        UpdateBundle,
        token,
      );

      return prepareSuccessResponse(UpdateBundleresponse, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async setBundleAsSelected(
    userId: string,
    bundleIds: string[],
    token: string,
  ): Promise<object> {
    try {
      const checkoutData = await marketplaceCheckoutHandler(
        userId,
        false,
        token,
      );
      const saleorCheckout = await checkoutHandler(
        checkoutData['checkoutId'],
        token,
      );
      const checkoutLines = getCheckoutLineItems(
        saleorCheckout['lines'],
        checkoutData['bundles'],
        bundleIds,
      );
      await addLinesHandler(checkoutData['checkoutId'], checkoutLines, token);
      const selectedBundles = selectOrUnselectBundle(
        checkoutData['bundles'],
        bundleIds,
        true,
      );
      const response = await addBundlesHandler(
        checkoutData['checkoutId'],
        userId,
        selectedBundles,
        token,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async setBundleAsUnselected({
    userId,
    bundleIds,
    checkoutBundleIds,
    token,
  }): Promise<object> {
    try {
      const checkoutData = await marketplaceCheckoutHandler(
        userId,
        false,
        token,
      );
      const saleorCheckout = await checkoutHandler(
        checkoutData['checkoutId'],
        token,
      );
      const checkoutLines = getCheckoutLineItemsForDelete(
        saleorCheckout['lines'],
        checkoutData['bundles'],
        checkoutBundleIds,
      );

      const checkoutLineIds = getCheckoutLineIds(checkoutLines);

      await deleteLinesHandler(checkoutLineIds, saleorCheckout['id'], token);
      const updatedBundle = selectOrUnselectBundle(
        checkoutData['bundles'],
        bundleIds,
        false,
      );
      const response = await addBundlesHandler(
        checkoutData['checkoutId'],
        userId,
        updatedBundle,
        token,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  protected async updateCartBundlesCheckoutIdService(
    userEmail: string,
    token: string,
    checkoutID: string,
  ) {
    try {
      /* The below code is updating the cart bundles for a checkout ID. */
      const response = await updateCartBundlesCheckoutIdHandler(
        userEmail,
        token,
        checkoutID,
      );

      return response;
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

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
