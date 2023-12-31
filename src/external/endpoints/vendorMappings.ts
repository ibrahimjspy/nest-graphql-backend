import { Logger } from '@nestjs/common';
import { MAPPING_SERVICE_HEADERS, SHOP_MAPPING_URL } from 'src/constants';
import { GetShopMapping } from 'src/modules/shop/dto/shop';
import http from 'src/core/proxies/restHandler';

/**
 * @description -- this method connects with mapping service and returns vendor mappings
 * which include source id, destination id and vendor name
 */
export const getVendorMapping = async (
  vendorMappingFilters: GetShopMapping,
) => {
  const {
    sourceId,
    destinationId,
    totalCount,
    page,
    isSharoveFulfillment,
    isPopular,
  } = vendorMappingFilters;
  const FILTERS = JSON.stringify({
    query: '',
    page: {
      size: Number(totalCount),
      current: Number(page),
    },
    filters: {
      all: [
        sourceId && { os_vendor_id: [sourceId] },
        destinationId && { shr_shop_id: [destinationId] },
        isSharoveFulfillment && {
          is_sharove_fulfillment: [isSharoveFulfillment],
        },
        isPopular && { is_popular: [isPopular] },
      ],
    },
  });
  Logger.log('fetching vendor mappings from elastic search', FILTERS);
  const response = await http.post(
    `${SHOP_MAPPING_URL}/search`,
    FILTERS,
    MAPPING_SERVICE_HEADERS,
  );

  const results = response?.data;
  return results;
};
