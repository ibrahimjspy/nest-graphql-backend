export const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
export const AUTH0_M2M_APP_CLIENT_ID = process.env.AUTH0_M2M_APP_CLIENT_ID;
export const AUTH0_M2M_APP_CLIENT_SECRET =
  process.env.AUTH0_M2M_APP_CLIENT_SECRET;
export const AUTH0_TTL_CACHE_TIME = 72000;

export const AUTH0_SPA_CONFIG = {
  clientId: process.env.AUTH0_CLIENT_ID || 'NHDmV7IkVh8s8zX1d5waoPolBAwwLSzT',
  scope: process.env.AUTH0_SCOPE || 'openid profile email offline_access',
  audience: process.env.AUTH0_AUDIENCE || 'sharove-dev-authorization',
  connection:
    process.env.AUTH0_CONNECTION || 'Username-Password-Authentication',
  grantType:
    process.env.AUTH0_GRANT_TYPE ||
    'http://auth0.com/oauth/grant-type/password-realm',
};
