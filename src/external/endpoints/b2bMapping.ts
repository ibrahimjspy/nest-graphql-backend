import http from 'src/core/proxies/restHandler';
import {
  B2B_PRODUCT_MAPPING_URL,
  MAPPING_SERVICE_HEADERS,
} from 'src/constants';
import { Logger } from '@nestjs/common';
import { ProductIdsMappingType } from './b2bMapping.types';
import { GetMappingDto } from 'src/modules/shop/dto/shop';

/**
 * @description -- this method connects with mapping service and returns orangeshine product
 * ids against a given array of b2b product ids
 * @param {string[]} productIds -- b2b product ids
 * @return {ProductIdsMappingType} -- orangeshine product ids mapping against b2b product ids
 */
export const getOsProductMapping = async (productIds: string[]) => {
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
      `${B2B_PRODUCT_MAPPING_URL}/search`,
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

/**
 * @description -- this method connects with mapping service and returns product mappings
 * which include source id, destination id
 */
export const getOsProductMappingV2 = async (
  vendorMappingFilters: GetMappingDto,
) => {
  const { sourceId, destinationId, totalCount, page } = vendorMappingFilters;
  const FILTERS = JSON.stringify({
    query: '',
    page: {
      size: Number(totalCount),
      current: Number(page),
    },
    filters: {
      all: [
        sourceId && { os_product_id: [sourceId] },
        destinationId && { shr_product_id: [destinationId] },
      ],
    },
  });
  Logger.log('fetching product mappings from elastic search', FILTERS);
  const response = await http.post(
    `${B2B_PRODUCT_MAPPING_URL}/search`,
    FILTERS,
    MAPPING_SERVICE_HEADERS,
  );

  const results = response?.data;
  return results;
};
