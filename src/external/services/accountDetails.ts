import { getAccountInfo } from 'src/external/endpoints/accountDetails';
import { prepareSuccessResponse } from 'src/core/utils/response';

export const getAccountInfoHandler = async (accountId: string) => {
  try {
    const resp = await getAccountInfo(accountId);
    return prepareSuccessResponse(resp?.data);
  } catch (error) {
    return error?.raw;
  }
};
