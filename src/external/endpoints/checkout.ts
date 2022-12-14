import http from 'src/core/proxies/restHandler';
import { BASE_EXTERNAL_ENDPOINT } from 'src/constants';

export const addShippingAddressInfo = async (
  shippingAddressInfo,
): Promise<object> => {
  const URL = `${BASE_EXTERNAL_ENDPOINT}/api/v3/my-account/shipping-address`;
  const response = await http.post(URL, shippingAddressInfo);
  return response?.data;
};
