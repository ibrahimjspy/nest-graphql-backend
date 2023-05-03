import { Injectable, Logger } from '@nestjs/common';
import { Auth0UserInputDTO } from 'src/modules/account/user/dto/user.dto';
import { updateOSUserInfo } from 'src/external/endpoints/retailer';

@Injectable()
export default class OSUserService {
  private readonly logger = new Logger(OSUserService.name);

  public async updateUser(
    userInput: Auth0UserInputDTO,
    token: string,
  ): Promise<object> {
    try {
      const userDetail = {
        firstName: userInput.firstName,
        lastName: userInput.lastName,
      };
      return await updateOSUserInfo(userDetail, token);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
