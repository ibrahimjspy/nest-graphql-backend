import axios from 'axios';
import http from 'src/core/proxies/restHandler';
import { BASE_EXTERNAL_ENDPOINT, COMMON_HEADERS } from 'src/constants';

export const retailerJobTitles = async () => {
  const URL = `${BASE_EXTERNAL_ENDPOINT}/api/v3/app/job-title`;
  const response = await http.get(URL, COMMON_HEADERS);
  return response;
};

export const checkRetailerEmail = async (email: string) => {
  const payload = { email: email };
  const URL = `${BASE_EXTERNAL_ENDPOINT}/api/v3/auth/email-availability`;
  const response = await http.post(URL, payload);
  return response;
};

export const uploadRetailerCertificate = async (file: any) => {
  const config: any = {
    method: 'post',
    url: `${BASE_EXTERNAL_ENDPOINT}/api/v3/user/buyer-resale-certificate`,
    headers: { 'Content-Type': 'multipart/form-data' },
    data: file,
  };
  const response = await axios.request(config);
  return response;
};
