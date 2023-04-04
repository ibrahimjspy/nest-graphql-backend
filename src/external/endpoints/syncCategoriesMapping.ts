import axios from 'axios';
import { AUTO_SYNC_MAPPING_URL, MAPPING_SERVICE_HEADERS } from 'src/constants';

export const getSyncCategories = async (retailerId: string) => {
  const filters = JSON.stringify({
    query: '',
    page: { size: 100 },
    filters: {
      all: [
        {
          shr_retailer_shop_id: retailerId,
        },
      ],
    },
  });
  const getSyncedCategoriesMapping = await axios.post(
    `${AUTO_SYNC_MAPPING_URL}/search`,
    filters,
    MAPPING_SERVICE_HEADERS,
  );
  return getSyncedCategoriesMapping.data;
};
