import http from 'src/core/proxies/restHandler';
import {
  ACCEPT_ENCODING_HEADER,
  BASE_EXTERNAL_ENDPOINT,
  COMMON_HEADERS,
} from 'src/constants';
import FormData from 'form-data';
import { RetailerRegisterDto } from '../../modules/shop/modules/retailer/dto';
import { ChangeUserPasswordDTO } from 'src/modules/account/user/dto/user.dto';
import { getTokenWithoutBearer } from 'src/modules/account/user/User.utils';
import { Auth0UserInputDTO } from 'src/modules/account/user/dto/user.dto';
import { transformOSUserInput } from 'src/modules/account/user/User.utils';

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
  const formData = new FormData();
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

export const retailerRegister = async (payload: RetailerRegisterDto) => {
  const URL = `${BASE_EXTERNAL_ENDPOINT}/api/v3/auth/sign-up`;
  const headers = {
    ...ACCEPT_ENCODING_HEADER,
  };
  const response = await http.post(URL, payload, { headers });
  return response;
};

export const retailerChangePassword = async (
  payload: ChangeUserPasswordDTO,
  token: string,
) => {
  const URL = `${BASE_EXTERNAL_ENDPOINT}/api/v3/user/profile/change-password`;

  const headers = {
    ...ACCEPT_ENCODING_HEADER,
    Authorization: getTokenWithoutBearer(token),
  };
  return await http.post(
    URL,
    {
      current_pwd: payload.currentPassword,
      new_pwd: payload.newPassword,
      confirm_new_pwd: payload.newPassword,
    },
    { headers },
  );
};

export const updateOSUserInfo = async (
  payload: Auth0UserInputDTO,
  token: string,
) => {
  const URL = `${BASE_EXTERNAL_ENDPOINT}/api/v3/user/profile`;
  const userDetail = transformOSUserInput(payload);
  const headers = {
    ...ACCEPT_ENCODING_HEADER,
    Authorization: getTokenWithoutBearer(token),
  };
  const response = await http.patch(URL, userDetail, { headers });
  return response.data?.data;
};
