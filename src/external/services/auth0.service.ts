import { Injectable } from '@nestjs/common';
import { ManagementClient } from 'auth0';
import {
  AUTH0_DOMAIN,
  AUTH0_M2M_APP_CLIENT_ID,
  AUTH0_M2M_APP_CLIENT_SECRET,
  AUTH0_TTL_CACHE_TIME,
} from 'src/constants';
import { Auth0UserInputDTO } from 'src/modules/account/user/dto/user.dto';

@Injectable()
export default class Auth0Service {
  private managementClient: ManagementClient;

  constructor() {
    this.managementClient = new ManagementClient({
      domain: AUTH0_DOMAIN,
      clientId: AUTH0_M2M_APP_CLIENT_ID,
      clientSecret: AUTH0_M2M_APP_CLIENT_SECRET,
      audience: `https://${AUTH0_DOMAIN}/api/v2/`,
      tokenProvider: {
        enableCache: true,
        cacheTTLInSeconds: AUTH0_TTL_CACHE_TIME,
      },
    });
  }

  public async updateUser(user: Auth0UserInputDTO) {
    const userDetail = await this.managementClient.updateUser(
      { id: user.userAuth0Id },
      {
        given_name: user.firstName,
        family_name: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
      },
    );
    return userDetail;
  }
}
