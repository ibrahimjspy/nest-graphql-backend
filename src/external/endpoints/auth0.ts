import {
  AUTH0_B2B_CONNECTION,
  AUTH0_DOMAIN,
  AUTH0_GRANT_TYPE,
  AUTH0_SPA_CLIENT_ID,
  AUTH0_SPA_SCOPE,
} from 'src/constants';
import http from 'src/core/proxies/restHandler';

export const validateAuth0Token = async (token: string) => {
  return await http.get(`https://${AUTH0_DOMAIN}/userinfo`, {
    headers: {
      Authorization: token,
    },
  });
};

export const getAuth0Tokens = async (email: string, password: string) => {
  const response = await http.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
    realm: AUTH0_B2B_CONNECTION,
    audience: 'sharove-dev-authorization',
    client_id: AUTH0_SPA_CLIENT_ID,
    scope: AUTH0_SPA_SCOPE,
    grant_type: AUTH0_GRANT_TYPE,
    username: email,
    password: password,
  });
  return response.data;
};
