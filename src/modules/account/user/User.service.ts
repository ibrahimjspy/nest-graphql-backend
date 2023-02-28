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
import { UserInputDTO } from './dto/user.dto';
@Injectable()
export class UserService {
  constructor(private shopService: ShopService) {
    return;
  }
  private readonly logger = new Logger(UserService.name);

  public async getUserinfo(token: string): Promise<SuccessResponseType> {
    try {
      const userDetails = await AccountHandlers.getUserDetailsHandler(token);
      const shopDetails = await this.shopService.getShopDetailsV2({
        email: userDetails['email'],
      });
      if (shopDetails['status'] == 200) {
        return prepareSuccessResponse({
          ...userDetails,
          shopDetails: shopDetails['data'],
        });
      }
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

  public async updateUserInfo(
    userInput: UserInputDTO,
    token: string,
  ): Promise<SuccessResponseType> {
    try {
      const response = await AccountHandlers.updateUserInfoHandler(
        userInput,
        token,
      );
      return prepareSuccessResponse(response);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
