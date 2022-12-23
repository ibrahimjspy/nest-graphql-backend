import http from 'src/core/proxies/restHandler';
import { BASE_EXTERNAL_ENDPOINT, COMMON_HEADERS } from 'src/constants';

export const retailerJobTitles = async () => {
  const URL = `${BASE_EXTERNAL_ENDPOINT}/api/v3/app/job-title`;
  const response = await http.get(URL, COMMON_HEADERS);
  return response;
};
