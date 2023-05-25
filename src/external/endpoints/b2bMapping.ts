import http from 'src/core/proxies/restHandler';
import {
  ELASTIC_SEARCH_ENDPOINT,
  MAPPING_SERVICE_HEADERS,
} from 'src/constants';
import { Logger } from '@nestjs/common';
import { ProductIdsMappingType } from './b2bMapping.types';

/**
 * @description -- this method connects with mapping service and returns orangeshine product
 * ids against a given array of b2b product ids
 * @param {string[]} productIds -- b2b product ids
 * @return {ProductIdsMappingType} -- orangeshine product ids mapping against b2b product ids
 */
export const getOsProductMapping = async (productIds: string[]) => {
  const MAPPING_SERVICE_URL = `${ELASTIC_SEARCH_ENDPOINT}/api/as/v1/engines/b2b-product-track-dev`;

  try {
    const FILTERS = JSON.stringify({
      query: '',
      page: { size: 100 },
      filters: {
        all: [
          {
            shr_b2b_product_id: productIds,
          },
        ],
      },
    });
    const response = await http.post(
      `${MAPPING_SERVICE_URL}/search`,
      FILTERS,
      MAPPING_SERVICE_HEADERS,
    );
    const results = response?.data?.results;
    const mapping: ProductIdsMappingType = new Map<string, string>();

    results.forEach((obj) => {
      const b2bProductId = obj.shr_b2b_product_id.raw;
      const osProductId = obj.os_product_id.raw;
      mapping.set(b2bProductId, osProductId);
    });

    return mapping;
  } catch (error) {
    Logger.error(error);
  }
};
