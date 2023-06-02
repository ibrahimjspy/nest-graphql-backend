export const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
export const AUTH0_M2M_APP_CLIENT_ID = process.env.AUTH0_M2M_APP_CLIENT_ID;
export const AUTH0_M2M_APP_CLIENT_SECRET =
  process.env.AUTH0_M2M_APP_CLIENT_SECRET;
export const AUTH0_TTL_CACHE_TIME = 72000;

export const AUTH0_SPA_CONFIG = {
  clientId: process.env.clientId || 'NHDmV7IkVh8s8zX1d5waoPolBAwwLSzT',
  scope: process.env.scope || 'openid profile email offline_access',
  audience: process.env.audience || 'sharove-dev-authorization',
  connection: process.env.connection || 'Username-Password-Authentication',
  grantType:
    process.env.grantType || 'http://auth0.com/oauth/grant-type/password-realm',
};
