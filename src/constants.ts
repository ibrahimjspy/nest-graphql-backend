import * as dotenv from 'dotenv';
dotenv.config();

export const DEFAULT_CHANNEL = 'default-channel';

export const DEFAULT_PAGE_SIZE = 10;

export const LIST_PAGE_SIZE = 30;

export const RECORDS_QUANTITY = 5;

export const GQL_EDGES = 'edges';

export const GQL_PAGE_INFO = 'pageInfo';

export const GQL_TOTAL_COUNT = 'totalCount';

//
export const COMMON_HEADERS = {
  headers: {
    'Content-Type': 'application/json',
    'Accept-Encoding': 'application/json',
  },
};

export const ACCEPT_ENCODING_HEADER = {
  'Accept-Encoding': 'application/json',
};

// OrangeShine Variables
export const SHAROVE_EMAIL = process.env.OS_EMAIL;
export const SHAROVE_PASSWORD = process.env.OS_PASSWORD;
export const BASE_EXTERNAL_ENDPOINT = process.env.OS_ENDPOINT;
export const PAYMENT_TYPE = process.env.OS_PAYMENT_TYPE;
export const STORE_CREDIT = process.env.OS_STORE_CREDIT;
export const SIGNATURE_REQUESTED = process.env.OS_SIGNATURE_REQUESTED;
export const SPM_ID = process.env.OS_SPM_ID;
export const SPA_ID = process.env.OS_SPA_ID;
export const SMS_NUMBER = process.env.OS_SMS_NUMBER;
export const IN_STOCK = 'in_stock';
export const PRE_ORDER = 'pre_order';
export const CATEGORY_SHOES = 'Shoes';
export const DEFAULT_WAREHOUSE_ID = process.env.DEFAULT_WAREHOUSE_ID;
export const OS_AWS_API_GATEWAY_ENDPOINT =
  process.env.OS_AWS_API_GATEWAY_ENDPOINT;
export const STAFF_TOKEN = process.env.STAFF_TOKEN;
