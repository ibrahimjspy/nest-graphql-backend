import { Injectable, Logger } from '@nestjs/common';
import { prepareSuccessResponse } from 'src/core/utils/response';
import { SuccessResponseType } from 'src/core/utils/response.type';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import * as AccountHandlers from 'src/graphql/handlers/account/user';
import { ShopService } from '../../shop/Shop.service';
import { User } from './dto/userinfo';
@Injectable()
export class UserService {
  constructor(private appService: ShopService) {
    return;
  }
  private readonly logger = new Logger(UserService.name);

  public async getUserinfo(Token: string): Promise<SuccessResponseType> {
    try {
      const UserDetails = await AccountHandlers.GetUserDetailsHandler(Token);
      const ShopDetails = await this.appService.GetShopDetailsbyEmail(
        UserDetails['email'],
      );
      const Userinfo: User = {
        ...UserDetails,
        Shop: ShopDetails.data.edges[0].node,
      };
      return prepareSuccessResponse(Userinfo);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
