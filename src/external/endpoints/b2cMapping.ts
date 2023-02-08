import http from 'src/core/proxies/restHandler';
import { MAPPING_SERVICE_HEADERS, MAPPING_SERVICE_URL } from 'src/constants';
import { Logger } from '@nestjs/common';

/**
 * @description -- this method connects with mapping service and returns b2c product
 * ids against a given array of b2b product ids and retailer id
 * @param - productIds -- b2b product ids
 * @param - retailer -- b2b retailer id -- not storefront id !!
 */
export const getB2cProductMapping = async (productIds, retailerId: string) => {
  try {
    const FILTERS = JSON.stringify({
      query: '',
      page: { size: 100 },
      filters: {
        all: [
          {
            shr_b2b_product_id: productIds,
          },
          {
            retailer_id: retailerId,
          },
        ],
      },
    });
    const response = await http.post(
      MAPPING_SERVICE_URL,
      FILTERS,
      MAPPING_SERVICE_HEADERS,
    );
    return response?.data?.results;
  } catch (error) {
    Logger.error(error);
  }
};
