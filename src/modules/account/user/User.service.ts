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
import { validateAuth0UserInput } from './User.utils';
import { B2C_ENABLED } from 'src/constants';

@Injectable()
export class UserService {
  constructor(
    private shopService: ShopService,
    private auth0Service: Auth0Service,
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
      const saleorUserDetails = await AccountHandlers.getUserDetailsHandler(token);
      const auth0UserDetail = await this.auth0Service.getAuth0User(userAuth0Id);
      const shopDetails = await this.shopService.getShopDetailsV2({
        email: saleorUserDetails['email'],
      });
      if (!B2C_ENABLED) {
        checkoutId = await AccountHandlers.getCheckoutIdFromMarketplaceHandler(
          saleorUserDetails['email'],
        );
      }
      if (shopDetails['status'] == 200) {
        saleorUserDetails['checkoutId'] = checkoutId;
        return prepareSuccessResponse({
          ...saleorUserDetails,
          shopDetails: shopDetails['data'],
        });
      }
      saleorUserDetails['checkoutId'] = checkoutId;
      return prepareSuccessResponse({
        saleor: saleorUserDetails,
        auth0: auth0UserDetail,
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
      const saleorUserInput = {
        firstName: userInput.firstName,
        lastName: userInput.lastName,
      };
      // update user info in saleor and auth0
      const [saleor, auth0] = await Promise.all([
        AccountHandlers.updateUserInfoHandler(
          saleorUserInput,
          token,
        ),
        this.auth0Service.updateAuth0User(
          userInput.userAuth0Id,
          validateAuth0UserInput(userInput),
        )
      ]) ;
      // update user info in auth0
      return prepareSuccessResponse({saleor, auth0});
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

}
