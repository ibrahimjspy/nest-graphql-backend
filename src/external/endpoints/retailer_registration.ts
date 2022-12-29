import http from 'src/core/proxies/restHandler';
import {
  BASE_EXTERNAL_ENDPOINT,
  COMMON_HEADERS,
  ACCEPT_ENCODING_HEADER,
} from 'src/constants';
import FormData from 'form-data';

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
  let formData = new FormData();
  formData.append('permit_img1', file.buffer, { filename: file.originalname });
  const requestAPI = `${BASE_EXTERNAL_ENDPOINT}/api/v3/user/buyer-resale-certificate`;
  const headers = {
    ...formData.getHeaders(),
    'Content-Length': formData.getLengthSync(),
    ...ACCEPT_ENCODING_HEADER,
  };

  const response = await http.post(requestAPI, formData, { headers });
  return response;
};

export const retailerRegister = async (payload: any) => {
  const URL = `${BASE_EXTERNAL_ENDPOINT}/api/v3/auth/sign-up`;
  const response = await http.post(URL, payload);
  return response;
};
