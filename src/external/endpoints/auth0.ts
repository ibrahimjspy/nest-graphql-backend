import { AUTH0_DOMAIN } from 'src/constants';
import http from 'src/core/proxies/restHandler';

export const validateAuth0Token = async (token: string) => {
  return await http.get(`https://${AUTH0_DOMAIN}/userinfo`, {
    headers: {
      Authorization: token,
    },
  });
};
