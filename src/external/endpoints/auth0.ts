import { Logger } from '@nestjs/common';
import { AUTH0_CONNECTION_LAMBDA_URL } from 'src/constants';
import http from 'src/core/proxies/restHandler';
import {
  AUTH0_DOMAIN,
  AUTH0_SPA_CONFIG,
} from 'src/modules/account/user/services/auth0.constants';

const AUTH0_URL = `https://${AUTH0_DOMAIN}`;

export const validateAuth0Token = async (token: string) => {
  return await http.get(`${AUTH0_URL}/userinfo`, {
    headers: {
      Authorization: token,
    },
  });
};

/**
 * @description -- this function authenticate user by user email and password
 * @param {string} email - user email
 * @param {string} password -  user password
 * @return this function return user authentication tokens
 */

export const authenticateAuth0User = async (
  email: string,
  password: string,
) => {
  try {
    const response = await http.post(`${AUTH0_URL}/oauth/token`, {
      realm: AUTH0_SPA_CONFIG.connection,
      audience: AUTH0_SPA_CONFIG.audience,
      client_id: AUTH0_SPA_CONFIG.clientId,
      scope: AUTH0_SPA_CONFIG.scope,
      grant_type: AUTH0_SPA_CONFIG.grantType,
      username: email,
      password: password,
    });
    return response?.data;
  } catch (error) {
    Logger.error(error);
  }
};

/**
 * @description -- this function create auth0 connection against given storefront id
 * for authentication against that storefront
 * @param {string} storeId -- storefront id
 * @return -- Auth0 response of connection creation agianst given storeId
 */

export const createAuth0Connection = async (storeId: string) => {
  try {
    Logger.log(`Creating auth0 connection for storefront ${storeId}`);
    const response = await http.post(`${AUTH0_CONNECTION_LAMBDA_URL}`, {
      storeId: storeId,
    });
    return response?.data;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
};
