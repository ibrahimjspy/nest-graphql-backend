import {
  PROVISION_STOREFRONT_HEADERS,
  PROVISION_STOREFRONT_URL,
} from 'src/constants';
import http from 'src/core/proxies/restHandler';
import { v4 as uuidv4 } from 'uuid';

export const provisionStoreFront = async (domainName: string) => {
  const response = await http.post(
    PROVISION_STOREFRONT_URL,
    {
      event_type: 'run-ci',
      client_payload: {
        id: uuidv4(),
        subdomain: domainName.split('.')[0], //splitting subdomain from complete domain
        createdAt: `${Date.now()}`,
      },
    },
    PROVISION_STOREFRONT_HEADERS,
  );
  return response;
};
