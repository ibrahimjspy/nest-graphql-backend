import http from 'src/core/proxies/restHandler';
import { OS_AWS_API_GATEWAY_ENDPOINT } from 'src/constants';

export const downloadProductImages = async (image_urls) => {
  const payload = { urls: image_urls };
  const URL = `${OS_AWS_API_GATEWAY_ENDPOINT}/production/download/`;
  const response = await http.post(URL, payload);
  return response;
};
