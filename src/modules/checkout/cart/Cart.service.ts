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

  /**
   * @description -- fetches shopping cart data from bundle service against userEmail
   */
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

  /**
   * @description -- this is private method which validates if bundles provided do not match aginst allready existing bundles
   * if so -- it adds those bundles against userEmail
   * @deprecated -- infuture we plan to have this logic in cart service so this method will be deprecated
   */
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

  /**
   * @description -- this is private method which validates if bundles provided do match against all ready existing bundles
   * if so -- it adds those bundles against userEmail
   * @deprecated -- infuture we plan to have this logic in cart service so this method will be deprecated
   */
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

  /**
   * @description -- this method adds bundles to cart against a user id
   * @deprecated -- it has additional call to fetch bundle status which in future will be deprecated as this logic will move to shop service
   * @deprecated -- in future usage of both update bundles and add bundles will be deprecated as they are adding useless validation logic to add to cart
   */
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

  /**
   * @description -- removes given bundles from cart against a user email
   */
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

  /**
   * @description -- updates bundle quantity in cart against a user email
   */
  public async updateBundleFromCart(
    userEmail: string,
    checkoutBundles,
    token: string,
  ): Promise<object> {
    try {
      const response = await updateCheckoutBundlesHandler(
        userEmail,
        checkoutBundles,
        token,
      );

      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- this method adds checkout id against a user checkout bundle session made against a user email
   */
  public async updateCartBundlesCheckoutIdService(
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
