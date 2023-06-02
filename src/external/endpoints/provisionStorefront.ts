import {
  ENVIRONMENT,
  PROVISION_STOREFRONT_HEADERS,
  PROVISION_STOREFRONT_URL,
  PROVISION_STOREFRONT_WORKFLOW_URL,
} from 'src/constants';
import http from 'src/core/proxies/restHandler';
import { v4 as uuidv4 } from 'uuid';
const enum EnvironmentEnum {
  DEV = 'dev',
  PROD = 'prod',
}
const enum EventTypeEnum {
  DEV = 'run-ci',
  PROD = 'production-ci',
}
export const provisionStoreFront = async (domainName: string) => {
  const EVENT_TYPE =
    ENVIRONMENT == EnvironmentEnum.DEV ? EventTypeEnum.DEV : EventTypeEnum.PROD;
  const response = await http.post(
    PROVISION_STOREFRONT_URL,
    {
      event_type: EVENT_TYPE,
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

export const provisionStoreFrontV2 = async (domainName: string) => {
  console.log('[provisionStoreFrontV2][input]', domainName);
  const subDomainName = domainName.split('.')[0]; //splitting subdomain from complete domain
  console.log('[provisionStoreFrontV2][subDomainName]', subDomainName);
  const response = await http.post(PROVISION_STOREFRONT_WORKFLOW_URL, {
    domainName: subDomainName,
  });
  console.log(response);
  return response.data;
};
