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
  Auth0UserInputDTO,
  ChangeUserPasswordDTO,
  UserAuth0IdDTO,
} from './dto/user.dto';
import Auth0Service from './services/auth0.service';
import { B2C_ENABLED } from 'src/constants';
import SaleorAuthService from './services/saleorAuth.service';
import { validateAuth0UserInput } from './User.utils';
import {
  retailerChangePassword,
  updateUserInfo,
} from 'src/external/endpoints/retailerRegistration';

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
    userAuth0Id: string,
    token: string,
  ): Promise<SuccessResponseType> {
    try {
      let checkoutId = null;
      const [saleor, auth0] = await Promise.all([
        AccountHandlers.getUserDetailsHandler(token),
        this.auth0Service.getUser(userAuth0Id),
      ]);
      const shopDetails = await this.shopService.getShopDetailsV2({
        email: saleor['email'],
      });
      if (B2C_ENABLED == 'false') {
        checkoutId = await AccountHandlers.getCheckoutIdFromMarketplaceHandler(
          saleor['email'],
        );
      }
      saleor['checkoutId'] = checkoutId;
      return prepareSuccessResponse({
        saleor,
        auth0,
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

  public async updateUserInfo(
    userInput: Auth0UserInputDTO,
    token: string,
  ): Promise<SuccessResponseType> {
    try {
      // update user info in saleor, auth0 and orangeshine
      const [saleor, auth0, os] = await Promise.all([
        this.saleorAuthService.updateUser(userInput, token),
        this.auth0Service.updateUser(
          userInput.userAuth0Id,
          validateAuth0UserInput(userInput),
        ),
        await updateUserInfo(userInput, token),
      ]);
      return prepareSuccessResponse({ saleor, auth0, os });
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
      // validate auth0 user token
      await this.auth0Service.validateAuth0User(userInput.userAuth0Id, token);
      let osReponse;
      if (B2C_ENABLED == 'false') {
        // change user password in orangeshine
        osReponse = await retailerChangePassword(userInput, token);
      }
      // change user password in auth0
      const auth0 = await this.auth0Service.changeUserPassword(
        userInput.userAuth0Id,
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
}
