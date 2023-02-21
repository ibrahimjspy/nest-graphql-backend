import { Injectable, Logger } from '@nestjs/common';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import {
  addCheckoutBundlesHandler,
  bundleStatusHandler,
  deleteBundlesHandler,
  getCheckoutBundlesHandler,
  updateCartBundlesCheckoutIdHandler,
  updateCheckoutBundleState,
  updateCheckoutBundlesHandler,
} from 'src/graphql/handlers/checkout';
import { CheckoutBundleInputType } from 'src/graphql/handlers/checkout.type';
import {
  getBundleIds,
  getNewBundlesList,
  getUpdatedBundlesList,
  validateBundlesLength,
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
      const checkoutData = await getCheckoutBundlesHandler(userEmail, token);
      return prepareSuccessResponse(checkoutData);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
  private async addBundles(
    bundlesForCart: any,
    validateBundleList: [],
    userEmail: string,
    token: string,
  ) {
    const bundlesList = await getNewBundlesList(
      bundlesForCart,
      validateBundleList,
    );
    const addedBundleList = await addCheckoutBundlesHandler(
      userEmail,
      bundlesList,
      token,
    );
    return addedBundleList;
  }

  // TODO make update bundles and update bundles from cart same
  private async updateBundles(
    bundlesForCart: any,
    validateBundleList: [],
    userEmail: string,
    token: string,
  ) {
    const bundleList = getUpdatedBundlesList(
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
      const bundleStatus = await bundleStatusHandler(
        userEmail,
        getBundleIdsArray,
        token,
      );
      /* The below code is checking if the bundleIdsExist in the cart or not. If it exists then it will
     update the bundle in the cart. If it does not exist then it will add the bundle in the cart. */
      if (validateBundlesLength(bundleStatus['bundleIdsExist'])) {
        const updateBundleList = await this.updateBundles(
          bundlesForCart,
          bundleStatus,
          userEmail,
          token,
        );

        response = {
          ...response,
          updateBundleList,
        };
      }
      if (validateBundlesLength(bundleStatus['bundleIdsNotExist'])) {
        const addBundleList = await this.addBundles(
          bundlesForCart,
          bundleStatus,
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
      const bundlesList = [bundlesFromCart];
      const response = await updateCheckoutBundlesHandler(
        userEmail,
        bundlesList,
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
