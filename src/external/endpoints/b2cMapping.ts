import http from 'src/core/proxies/restHandler';
import {
  MAPPING_SERVICE_HEADERS,
  MAPPING_SERVICE_TOKEN,
  MAPPING_SERVICE_URL,
} from 'src/constants';
import { Logger } from '@nestjs/common';
import axios from 'axios';
import { ProductIdsMappingType } from './b2bMapping.types';
import { ProductOriginEnum } from 'src/modules/product/Product.types';

/**
 * @description Retrieves B2C product IDs from the mapping service for a given array of B2B product IDs and retailer ID.
 * @param productIds - Array of B2B product IDs.
 * @param retailerId - B2B retailer ID (not storefront ID).
 * @param productOrigin - Origin of the products (default: 'B2B'). - product for which you want to get mapping for -- passing B2B will return b2c mappings against it
 * @returns Array of B2C product IDs.
 */
export const getB2cProductMapping = async (
  productIds: string[],
  retailerId: string,
  productOrigin = ProductOriginEnum.B2B,
) => {
  try {
    const filters = JSON.stringify({
      query: '',
      page: { size: 100 },
      filters: {
        all: [
          productOrigin === ProductOriginEnum.B2B
            ? { shr_b2b_product_id: productIds }
            : { shr_b2c_product_id: productIds },
          { retailer_id: retailerId },
        ],
      },
    });

    const response = await http.post(
      `${MAPPING_SERVICE_URL}/search`,
      filters,
      MAPPING_SERVICE_HEADERS,
    );

    return response?.data?.results;
  } catch (error) {
    Logger.error(error);
    return undefined;
  }
};

/**
 * @description -- this method connects with mapping service and returns b2c product
 * ids against a given array of b2b product ids and retailer id
 * @param - productIds -- b2b product ids
 * @param - retailer -- b2b retailer id -- not storefront id !!
 */
export const getB2cMappingIds = async (productIds: string[]) => {
  try {
    const mappingIds = [];
    const FILTERS = JSON.stringify({
      query: '',
      page: { size: 100 },
      filters: {
        all: [
          {
            shr_b2c_product_id: productIds,
          },
        ],
      },
    });
    const getProductMapping = await http.post(
      `${MAPPING_SERVICE_URL}/search`,
      FILTERS,
      MAPPING_SERVICE_HEADERS,
    );
    getProductMapping?.data?.results.map((mapping) => {
      mappingIds.push(mapping.id.raw);
    });
    return mappingIds;
  } catch (error) {
    Logger.error(error);
  }
};

/**
 * @description -- this method connects with mapping service and returns b2c product
 * ids against a given array of b2b product ids and retailer id
 * @param - productIds -- b2b product ids
 * @param - retailer -- b2b retailer id -- not storefront id !!
 */
export const removeB2cProductMapping = async (productIds) => {
  try {
    const mappingIds: string[] = await getB2cMappingIds(productIds);
    const deleteProductMapping = await axios({
      method: 'delete',
      url: `${MAPPING_SERVICE_URL}/documents`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer private-${MAPPING_SERVICE_TOKEN}`,
      },
      data: mappingIds,
    });
    return deleteProductMapping?.data;
  } catch (error) {
    Logger.error(error);
  }
};

/**
 * @description -- this method connects with mapping service and returns b2b product ids
 * @param {string[]} productIds -- b2c product ids
 * @return {ProductIdsMappingType} -- b2b product ids mapping against b2c product ids
 */
export const getB2bProductMapping = async (productIds: string[]) => {
  try {
    const FILTERS = JSON.stringify({
      query: '',
      page: { size: 100 },
      filters: {
        all: [
          {
            shr_b2c_product_id: productIds,
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
    const mapping: ProductIdsMappingType = new Map();

    results.forEach((obj) => {
      const b2cProductId = obj.shr_b2c_product_id.raw;
      const b2bProductId = obj.shr_b2b_product_id.raw;
      mapping.set(b2cProductId, b2bProductId);
    });

    return mapping;
  } catch (error) {
    Logger.error(error);
  }
};
