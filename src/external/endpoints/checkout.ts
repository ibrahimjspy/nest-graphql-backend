import http from 'src/core/proxies/restHandler';
import { BASE_EXTERNAL_ENDPOINT } from 'src/constants';

export const addShippingAddressInfo = async (
  shippingAddressInfo,
  token: string,
): Promise<object> => {
  const header = {
    headers: { Authorization: token },
  };
  const URL = `${BASE_EXTERNAL_ENDPOINT}/api/v3/my-account/shipping-address`;
  const response = await http.post(URL, shippingAddressInfo, header);
  return response?.data;
};
