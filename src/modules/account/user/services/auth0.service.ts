import { Injectable } from '@nestjs/common';
import { ManagementClient } from 'auth0';
import {
  AUTH0_DOMAIN,
  AUTH0_M2M_APP_CLIENT_ID,
  AUTH0_M2M_APP_CLIENT_SECRET,
  AUTH0_TTL_CACHE_TIME,
} from 'src/constants';
import { Auth0UserDetailType } from 'src/modules/account/user/User.types';
import { validateObjectLength } from 'src/modules/account/user/User.utils';

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

  public async updateUser(
    userAuth0Id: string,
    userDetail: Auth0UserDetailType,
  ) {
    if (!validateObjectLength(userDetail)) {
      return;
    }
    return await this.managementClient.updateUser(
      { id: userAuth0Id },
      userDetail,
    );
  }

  public async changeUserPassword(
    userAuth0Id: string,
    newPassword: string,
  ) {
    return await this.managementClient.updateUser(
      { id: userAuth0Id },
      {
        password: newPassword
      },
    );
  }

  public async getUser(userAuth0Id: string) {
    return await this.managementClient.getUser({
      id: userAuth0Id,
    });
  }
}
