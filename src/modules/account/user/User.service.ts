import { Injectable, Logger } from '@nestjs/common';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import { SuccessResponseType } from 'src/core/utils/response.type';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import * as AccountHandlers from 'src/graphql/handlers/account/user';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import {
  AllUsersDTO,
  Auth0UserInputDTO,
  ChangeUserPasswordDTO,
  UserAuth0IdDTO,
} from './dto/user.dto';
import Auth0Service from './services/auth0.service';
import { B2C_ENABLED } from 'src/constants';
import SaleorAuthService from './services/saleorAuth.service';
import OSUserService from 'src/external/services/osUser.service';
import { getUserByToken, validateAuth0UserInput } from './User.utils';
import { Auth0UserDetailType } from './User.types';
import { retailerChangePassword } from 'src/external/endpoints/retailer';
import { ShopService } from 'src/modules/shop/services/shop/Shop.service';

@Injectable()
export class UserService {
  constructor(
    private shopService: ShopService,
    private auth0Service: Auth0Service,
    private saleorAuthService: SaleorAuthService,
    private osUserService: OSUserService,
  ) {
    return;
  }
  private readonly logger = new Logger(UserService.name);

  public async getUserinfo(
    token: string,
    isB2c = false,
  ): Promise<SuccessResponseType> {
    try {
      let checkoutIds = null;
      const userDetails = await AccountHandlers.getUserDetailsHandler(token);
      const shopDetails = await this.shopService.getShopDetailsV2({
        email: userDetails['email'],
      });
      if (!isB2c) {
        checkoutIds = await AccountHandlers.getCheckoutIdFromMarketplaceHandler(
          userDetails['email'],
        );
      }
      if (shopDetails['status'] == 200) {
        userDetails['checkoutId'] = checkoutIds[0] || null;
        userDetails['checkoutIds'] = checkoutIds;
        return prepareSuccessResponse({
          ...userDetails,
          shopDetails: shopDetails['data'],
        });
      }
      userDetails['checkoutId'] = checkoutIds;
      return prepareSuccessResponse({
        ...userDetails,
        shopDetails: shopDetails,
      });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RecordNotFound) {
        return prepareFailedResponse(error.message);
      }
      return graphqlExceptionHandler(error);
    }
  }

  public async getUserinfoV2(token: string): Promise<SuccessResponseType> {
    try {
      const userDetail: Auth0UserDetailType = getUserByToken(token);
      const userAuth0Id = userDetail?.sub;
      const userEmail = userDetail?.email;
      let checkoutId: unknown = null;
      let shopDetails: unknown = null;

      const [saleor, auth0] = await Promise.all([
        AccountHandlers.getUserDetailsHandler(token),
        this.auth0Service.getUser(userAuth0Id),
      ]);

      if (B2C_ENABLED == 'false') {
        shopDetails = await this.shopService.getShopDetailsV2({
          email: userEmail,
        });
        checkoutId = await AccountHandlers.getCheckoutIdFromMarketplaceHandler(
          userEmail,
        );
      }
      saleor['checkoutId'] = checkoutId;
      return prepareSuccessResponse({
        saleor,
        auth0,
        ...(shopDetails && { shopDetails }),
      });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RecordNotFound) {
        return prepareFailedResponse(error.message);
      }
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * Update user information in Auth0, Saleor and OrangeShine
   * @param {string} token - paramter of string type
   * Run the services and handler using Promise.all
   * @returns {object} return objects of saleor, auth0, orangeshineResponse in one object.
   */

  public async updateUserInfo(
    userInput: Auth0UserInputDTO,
    token: string,
  ): Promise<SuccessResponseType> {
    try {
      const userDetail: Auth0UserDetailType = getUserByToken(token);
      const userAuth0Id = userDetail?.sub;
      let orangeshineResponse: unknown = null;

      const [saleor, auth0] = await Promise.all([
        this.saleorAuthService.updateUser(userInput, token),
        this.auth0Service.updateUser(
          userAuth0Id,
          validateAuth0UserInput(userInput),
        ),
      ]);
      if (B2C_ENABLED == 'false') {
        orangeshineResponse = await this.osUserService.updateUser(
          userInput,
          token,
        );
      }
      return prepareSuccessResponse({ saleor, auth0, orangeshineResponse });
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @deprecated Need to depracted this API in future
   */
  public async changeUserPassword(
    userInput: ChangeUserPasswordDTO,
    token: string,
  ): Promise<SuccessResponseType> {
    try {
      const userDetail = getUserByToken(token);
      const userAuth0Id = userDetail?.sub;

      // validate auth0 user token
      await this.auth0Service.validateAuth0User(userAuth0Id, token);
      let osReponse;
      if (B2C_ENABLED == 'false') {
        // change user password in orangeshine
        osReponse = await retailerChangePassword(userInput, token);
      }
      // change user password in auth0
      const auth0 = await this.auth0Service.changeUserPassword(
        userAuth0Id,
        userInput.newPassword,
      );
      return prepareSuccessResponse({ osReponse: osReponse?.data, auth0 });
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async sendVerificationEmail(
    userInput: UserAuth0IdDTO,
  ): Promise<SuccessResponseType> {
    try {
      const auth0 = await this.auth0Service.sendVerificationEmail(
        userInput.userAuth0Id,
      );
      return prepareSuccessResponse(auth0);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async deactivateUser(
    userInput: UserAuth0IdDTO,
  ): Promise<SuccessResponseType> {
    try {
      const auth0 = await this.auth0Service.deactivateUser(
        userInput.userAuth0Id,
      );
      return prepareSuccessResponse(auth0);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async activateUser(
    userInput: UserAuth0IdDTO,
  ): Promise<SuccessResponseType> {
    try {
      const auth0 = await this.auth0Service.activateUser(userInput.userAuth0Id);
      return prepareSuccessResponse(auth0);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * Get all users from auth0 based on given auth0 connection name and pagination
   * @param {AllUsersDTO} userInput - auth0Connection and pagination paramaters
   * @returns All Users from auth0 based on auth0 connection with pagination.
   */
  public async getUsers(userInput: AllUsersDTO): Promise<SuccessResponseType> {
    try {
      const users = await this.auth0Service.getUsers(userInput);
      return prepareSuccessResponse(users);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
