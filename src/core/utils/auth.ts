import http from '../services/http';

export const getAccessToken = async (): Promise<any> => {
  const URL = `${process.env.EXTERNAL_ENDPOINT}/api/v3/auth/token`;
  const bodyParameters = {
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
  };

  return await http.post(URL, bodyParameters);
};
