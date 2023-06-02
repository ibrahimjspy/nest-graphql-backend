import { Injectable } from '@nestjs/common';
import { ManagementClient } from 'auth0';
import { validateAuth0Token } from 'src/external/endpoints/auth0';
import { Auth0UserDetailType } from 'src/modules/account/user/User.types';
import { validateObjectLength } from 'src/modules/account/user/User.utils';
import { AllUsersDTO } from '../dto/user.dto';
import {
  AUTH0_DOMAIN,
  AUTH0_M2M_APP_CLIENT_ID,
  AUTH0_M2M_APP_CLIENT_SECRET,
  AUTH0_TTL_CACHE_TIME,
} from './auth0.constants';

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

  public async validateAuth0User(userAuth0Id: string, token: string) {
    const response = await validateAuth0Token(token);
    if (response?.data?.sub !== userAuth0Id) {
      throw new Error('Unauthorized');
    }
    return response;
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

  public async changeUserPassword(userAuth0Id: string, newPassword: string) {
    return await this.managementClient.updateUser(
      { id: userAuth0Id },
      {
        password: newPassword,
      },
    );
  }

  public async getUser(userAuth0Id: string) {
    return await this.managementClient.getUser({
      id: userAuth0Id,
    });
  }

  public async sendVerificationEmail(userAuth0Id: string) {
    return await this.managementClient.sendEmailVerification({
      user_id: userAuth0Id,
    });
  }

  public async deactivateUser(userAuth0Id: string) {
    return await this.managementClient.updateUser(
      { id: userAuth0Id },
      { blocked: true },
    );
  }

  public async activateUser(userAuth0Id: string) {
    return await this.managementClient.updateUser(
      { id: userAuth0Id },
      { blocked: false },
    );
  }

  /**
   * Get all users from auth0 based on given auth0 connection name and pagination
   * @param {AllUsersDTO} userInput - auth0Connection and pagination paramaters
   * @info q - this paramter use for search by user attributes like name,email or connection etc.
   * @info search_engine - we need to pass auth0 search engine version v3 for query
   * @info include_totals we need to set this true because we need total counts and pagination
   * @returns All Users from auth0 based on auth0 connection with pagination.
   */
  public async getUsers(userInput: AllUsersDTO) {
    return await this.managementClient.getUsers({
      q: `identities.connection:${userInput.auth0Connection}`,
      page: userInput.page,
      per_page: userInput.perPage,
      search_engine: 'v3',
      include_totals: true,
    });
  }
}
