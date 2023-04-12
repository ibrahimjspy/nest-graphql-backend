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
import { Auth0UserInputDTO } from './dto/user.dto';
import Auth0Service from 'src/external/services/auth0.service';
import { B2C_ENABLED } from 'src/constants';
import SaleorAuthService from 'src/external/services/saleorAuth.service';

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
      if (!B2C_ENABLED) {
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
      const [saleor, auth0] = await this.saleorAuthService.updateUser(userInput, token)
      // update user info in auth0
      return prepareSuccessResponse({ saleor, auth0 });
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
