import * as dotenv from 'dotenv';
dotenv.config();

export const DEFAULT_CHANNEL = 'default-channel';

export const DEFAULT_PAGE_SIZE = 10;

export const LIST_PAGE_SIZE = 30;

export const RECORDS_QUANTITY = 5;

export const GQL_EDGES = 'edges';

export const GQL_PAGE_INFO = 'pageInfo';

export const GQL_TOTAL_COUNT = 'totalCount';

// OrangeShine Variables
export const SHAROVE_EMAIL = process.env.EMAIL;
export const SHAROVE_PASSWORD = process.env.PASSWORD;
export const BASE_EXTERNAL_ENDPOINT = process.env.EXTERNAL_ENDPOINT;
export const PAYMENT_TYPE = process.env.PAYMENT_TYPE;
export const STORE_CREDIT = process.env.STORE_CREDIT;
export const SIGNATURE_REQUESTED = process.env.SIGNATURE_REQUESTED;
export const SPM_ID = process.env.SPM_ID;
export const SPA_ID = process.env.SPA_ID;
export const SMS_NUMBER = process.env.SMS_NUMBER;
export const IN_STOCK = 'in_stock';
export const PRE_ORDER = 'pre_order';
export const CATEGORY_SHOES = 'Shoes';
export const OS_AWS_API_GATEWAY_ENDPOINT =
  process.env.OS_AWS_API_GATEWAY_ENDPOINT;
