import { AUTO_SYNC_API_URL } from 'src/constants';
import http from 'src/core/proxies/restHandler';
import { ImportBulkCategoriesDto } from 'src/modules/shop/dto/autoSync';

export const autoSyncHandler = async (
  autoSyncInput: ImportBulkCategoriesDto,
) => {
  const MAPPING_URL = `${AUTO_SYNC_API_URL}/api/v2/auto/sync`;
  const response = await http.post(MAPPING_URL, autoSyncInput);
  return response.data;
};
