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
      const Userinfo: User = {
        ...UserDetails,
        Shop: ShopDetails.length < 0 ? 'null' : ShopDetails[0].node,
      };
      return prepareSuccessResponse(Userinfo);
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RecordNotFound) {
        return prepareFailedResponse(error.message);
      }
      return graphqlExceptionHandler(error);
    }
  }
}
