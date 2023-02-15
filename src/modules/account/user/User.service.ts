import { Injectable, Logger } from '@nestjs/common';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import { SuccessResponseType } from 'src/core/utils/response.type';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import * as AccountHandlers from 'src/graphql/handlers/account/user';
import { ShopService } from '../../shop/Shop.service';
import { User } from './dto/userinfo';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import { UserInputDTO } from './dto/user.dto';
@Injectable()
export class UserService {
  constructor(private shopService: ShopService) {
    return;
  }
  private readonly logger = new Logger(UserService.name);

  public async getUserinfo(Token: string): Promise<SuccessResponseType> {
    try {
      const UserDetails = await AccountHandlers.getUserDetailsHandler(Token);
      const ShopDetails = await this.shopService.getShopDetailsbyEmail(
        UserDetails['email'],
      );
      let Userinfo: User = {};
      /* This is a way to check if the shop is present or not. */
      if (ShopDetails['message']) {
        Userinfo = {
          ...UserDetails,
          Shop: null,
        };
      } else {
        Userinfo = {
          ...UserDetails,
          Shop: ShopDetails['edges'][0].node,
        };
      }
      return prepareSuccessResponse(Userinfo);
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
      const response = await AccountHandlers.updateUserInfoHandler(userInput, token);
      const userToken = "";
      return prepareSuccessResponse(response, userToken, 200);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
