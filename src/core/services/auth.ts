import http from 'src/core/proxies/restHandler';

export class AuthService {
  private BASE_EXTERNAL_ENDPOINT: string;

  constructor(base_endpoint: string) {
    this.BASE_EXTERNAL_ENDPOINT = base_endpoint;
  }

  public async getToken(email: string, password: string) {
    const URL = `${this.BASE_EXTERNAL_ENDPOINT}/api/v3/auth/token`;
    const bodyParameters = {
      email: email,
      password: password,
    };

    const resp = await http.post(URL, bodyParameters);
    return resp?.data;
  }
}
