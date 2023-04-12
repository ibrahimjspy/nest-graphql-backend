import { Injectable, Logger } from '@nestjs/common';
import { Auth0UserInputDTO } from 'src/modules/account/user/dto/user.dto';
import * as AccountHandlers from 'src/graphql/handlers/account/user';
import Auth0Service from './auth0.service';

@Injectable()
export default class SaleorAuthService {
  private readonly logger = new Logger(Auth0Service.name);

  public async updateUser(
    userInput: Auth0UserInputDTO,
    token: string,
  ): Promise<object> {
    try {
      const userDetail = {
        firstName: userInput.firstName,
        lastName: userInput.lastName,
      };
      // update user info in saleor and auth0
      return await AccountHandlers.updateUserInfoHandler(userDetail, token);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
