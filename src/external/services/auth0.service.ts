import { Injectable } from '@nestjs/common';
import { ManagementClient } from 'auth0';
import {
  AUTH0_DOMAIN,
  AUTH0_M2M_APP_CLIENT_ID,
  AUTH0_M2M_APP_CLIENT_SECRET,
  AUTH0_TTL_CACHE_TIME,
} from 'src/constants';
import { Auth0UserDetailType } from 'src/modules/account/user/User.types';

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

  public async updateAuth0User(userAuth0Id: string, userDetail: Auth0UserDetailType) {
    if(!Object.keys(userDetail).length){
      return;
    }
    return await this.managementClient.updateUser(
      { id: userAuth0Id },
      userDetail,
    );
  }

  public async getAuth0User(userAuth0Id: string) {
    return await this.managementClient.getUser({
      id: userAuth0Id,
    });
  }
}
