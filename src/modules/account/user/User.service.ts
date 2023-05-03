import { Injectable, Logger } from '@nestjs/common';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import { SuccessResponseType } from 'src/core/utils/response.type';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import * as AccountHandlers from 'src/graphql/handlers/account/user';
import { ShopService } from '../../shop/Shop.service';
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
import { getUserByToken, validateAuth0UserInput } from './User.utils';
import { retailerChangePassword } from 'src/external/endpoints/retailer_registration';

@Injectable()
export class UserService {
  constructor(
    private shopService: ShopService,
    private auth0Service: Auth0Service,
    private saleorAuthService: SaleorAuthService,
  ) {
    return;
  }
  private readonly logger = new Logger(UserService.name);

  public async getUserinfo(
    token: string,
    isB2c = false,
  ): Promise<SuccessResponseType> {
    try {
      let checkoutId = null;
      const userDetails = await AccountHandlers.getUserDetailsHandler(token);
      const shopDetails = await this.shopService.getShopDetailsV2({
        email: userDetails['email'],
      });
      if (!isB2c) {
        checkoutId = await AccountHandlers.getCheckoutIdFromMarketplaceHandler(
          userDetails['email'],
        );
      }
      if (shopDetails['status'] == 200) {
        userDetails['checkoutId'] = checkoutId;
        return prepareSuccessResponse({
          ...userDetails,
          shopDetails: shopDetails['data'],
        });
      }
      userDetails['checkoutId'] = checkoutId;
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

  public async getUserinfoV2(
    token: string,
  ): Promise<SuccessResponseType> {
    try {
      const userDetail = getUserByToken(token);
      const userAuth0Id = userDetail['sub'];
      const userEmail = userDetail['email'];
      let checkoutId = null;
      let shopDetails = null;

      const [saleor, auth0] = await Promise.all([
        AccountHandlers.getUserDetailsHandler(token),
        this.auth0Service.getUser(userAuth0Id)
      ]);

      if (B2C_ENABLED == 'false') {
        shopDetails = await this.shopService.getShopDetailsV2({
          email: userEmail,
        })
        checkoutId = await AccountHandlers.getCheckoutIdFromMarketplaceHandler(
          userEmail,
        );
      }
      saleor['checkoutId'] = checkoutId;
      return prepareSuccessResponse({
        saleor,
        auth0,
        ...(shopDetails && {shopDetails}),
      });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RecordNotFound) {
        return prepareFailedResponse(error.message);
      }
      return graphqlExceptionHandler(error);
    }
  }

  public async updateUserInfo(
    userInput: Auth0UserInputDTO,
    token: string,
  ): Promise<SuccessResponseType> {
    try {
      const userDetail = getUserByToken(token);
      const userAuth0Id = userDetail["sub"];
      // update user info in saleor and auth0
      const [saleor, auth0] = await Promise.all([
        this.saleorAuthService.updateUser(userInput, token),
        this.auth0Service.updateUser(
          userAuth0Id,
          validateAuth0UserInput(userInput),
        ),
      ]);
      // update user info in auth0
      return prepareSuccessResponse({ saleor, auth0 });
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async changeUserPassword(
    userInput: ChangeUserPasswordDTO,
    token: string,
  ): Promise<SuccessResponseType> {
    try {
      const userDetail = getUserByToken(token);
      const userAuth0Id = userDetail["sub"];

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
    token: string
  ): Promise<SuccessResponseType> {
    const userDetail = getUserByToken(token);
    const userAuth0Id = userDetail["sub"];

    try {
      const auth0 = await this.auth0Service.sendVerificationEmail(
        userAuth0Id,
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
