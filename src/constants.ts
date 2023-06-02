import * as dotenv from 'dotenv';
dotenv.config();

export const DEFAULT_CHANNEL = 'default-channel';

export const DEFAULT_PAGE_SIZE = 10;

export const LIST_PAGE_SIZE = 30;

export const RECORDS_QUANTITY = 5;

export const GQL_EDGES = 'edges';

export const GQL_PAGE_INFO = 'pageInfo';

export const GQL_TOTAL_COUNT = 'totalCount';

export const B2BClientPlatform = 'sharove@sharove.com';

export const STRIPE_RETURN_URL = process.env.B2B_ENDPOINT;
export const DEFAULT_THUMBNAIL_SIZE = 512;
export const SQS_MESSAGE_GROUPID = '1';
//
export const COMMON_HEADERS = {
  headers: {
    'Content-Type': 'application/json',
    'Accept-Encoding': 'application/json',
  },
};

export const PROVISION_STOREFRONT_HEADERS = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.AUTH_TOKEN_GITHUB}`,
  },
};

export const ACCEPT_ENCODING_HEADER = {
  'Accept-Encoding': 'application/json',
};

// OrangeShine Variables
export const SHAROVE_EMAIL = process.env.OS_EMAIL;
export const SHAROVE_PASSWORD = process.env.OS_PASSWORD;
export const SHAROVE_STRIPE_PAYMENT_METHOD =
  process.env.SHAROVE_STRIPE_PAYMENT_METHOD || 'pm_1NBliPHH1XVL0zjbClGzN1hX';
export const BASE_EXTERNAL_ENDPOINT = process.env.OS_ENDPOINT;
export const SHIPPING_METHOD = process.env.SHIPPING_METHOD || 'UPS';
export const B2C_ORDER_TYPE = 'D2C';
export const PAYMENT_TYPE = process.env.CHECKOUT_PAYMENT_TYPE || 'credit_card';
export const STORE_CREDIT = process.env.OS_STORE_CREDIT || '0';
export const SIGNATURE_REQUESTED =
  process.env.OS_SIGNATURE_REQUESTED || 'false';
export const SPM_ID = process.env.OS_SPM_ID;
export const SPA_ID = process.env.OS_SPA_ID;
export const SMS_NUMBER = process.env.OS_SMS_NUMBER || '234-9882';
export const IN_STOCK = 'in_stock';
export const PRE_ORDER = 'pre_order';
export const CATEGORY_SHOES = 'Shoes';
export const DEFAULT_WAREHOUSE_ID = process.env.DEFAULT_WAREHOUSE_ID;
export const OPEN_TELEMENTRY_TRACING_IP =
  process.env.OPEN_TELEMENTRY_TRACING_IP;
export const OS_AWS_API_GATEWAY_ENDPOINT =
  process.env.OS_AWS_API_GATEWAY_ENDPOINT;
export const B2C_DEVELOPMENT_TOKEN = process.env.B2C_DEVELOPMENT_TOKEN;
export const PROVISION_STOREFRONT_URL = process.env.PROVISION_STOREFRONT_URL;
export const PROVISION_STOREFRONT_WORKFLOW_URL =
  process.env.PROVISION_STOREFRONT_WORKFLOW;
export const B2C_ENDPOINT = process.env.B2C_ENDPOINT;
export const B2B_ENDPOINT = process.env.B2B_ENDPOINT;
export const B2C_ENABLED = process.env.B2C_ENABLED;
export const B2B_DEVELOPMENT_TOKEN = process.env.B2B_DEVELOPMENT_TOKEN;
export const MAPPING_SERVICE_TOKEN = process.env.MAPPING_SERVICE_TOKEN;
export const MAPPING_SERVICE_HEADERS = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer private-${MAPPING_SERVICE_TOKEN}`,
  },
};
export const MAPPING_SERVICE_URL = process.env.MAPPING_SERVICE_URL;

export const UPS_URL = process.env.UPS_URL;
export const UPS_CONFIGURATIONS = {
  headers: {
    Authorization: `Basic ${process.env.UPS_USER_TOKEN}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

export const B2C_STOREFRONT_TLD = '.sharove.co';

export const preAuthTransactionInput = {
  status: 'Authorized',
  type: 'Credit card',
  currency: 'USD',
  eventStatus: 'SUCCESS',
  eventName: 'Authorized credit card',
  availableActions: '[VOID, CHARGE]',
};
export const SHAROVE_BILLING_ADDRESS = {
  first_name: 'Azhar',
  last_name: 'Iqbal',
  address1: '9956B Foxrun St. Poughkeepsie, NY 12603',
  city: 'Poughkeepsie',
  state: 'NY',
  zipcode: '10001',
  country: 'US',
  phone_number: '(922) 322-8703',
  nick_name: 'Sharove',
  address2: '',
  company_name: 'Sharove',
};

export const PROMOTION_SHIPPING_METHOD_ID =
  process.env.PROMOTION_SHIPPING_METHOD_ID || 'U2hpcHBpbmdNZXRob2Q6NzA=';
export const B2B_CHECKOUT_APP_TOKEN = process.env.B2B_CHECKOUT_APP_TOKEN;
export const ELASTIC_SEARCH_ENDPOINT = process.env.ELASTIC_SEARCH_ENDPOINT;
export const AUTO_SYNC_MAPPING_URL = `${ELASTIC_SEARCH_ENDPOINT}/api/as/v1/engines/auto-sync-category-mapping`;

export const UPS_TRACKING_HEADERS = {
  headers: {
    'Content-Type': 'application/json',
    transId: process.env.UPS_TRANSACTION_ID || 'test',
    transactionSrc: process.env.UPS_TRANSACTION_SOURCE || 'test',
  },
};
export const AUTO_SYNC_API_URL = process.env.AUTO_SYNC_API_URL;
export const WORKFLOW_URL = process.env.WORKFLOW_URL;

/**
 * @description - this is to specify which environment middleware is deployed in
 * @options -- prod || dev
 */
export const ENVIRONMENT = process.env.ENVIRONMENT || 'dev';
