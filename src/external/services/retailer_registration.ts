import {
  checkRetailerEmail,
  retailerJobTitles,
  uploadRetailerCertificate,
  retailerRegister,
} from 'src/external/endpoints/retailer_registration';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import { getHttpErrorMessage } from 'src/external/utils/httpHelper';

export const retailerJobTitlesHandler = async () => {
  try {
    const resp = await retailerJobTitles();
    return prepareSuccessResponse(resp?.data);
  } catch (error) {
    const error_obj = getHttpErrorMessage(error);
    return prepareFailedResponse(error_obj?.message?.data);
  }
};

export const checkRetailerEmailHandler = async (email: string) => {
  try {
    const resp = await checkRetailerEmail(email);
    return prepareSuccessResponse(resp?.data);
  } catch (error) {
    const error_obj = getHttpErrorMessage(error);
    return prepareFailedResponse(error_obj?.message?.data);
  }
};

export const uploadRetailerCertificateHandler = async (file: any) => {
  try {
    const resp = await uploadRetailerCertificate(file);
    return prepareSuccessResponse(resp?.data);
  } catch (error) {
    const error_obj = getHttpErrorMessage(error);
    return prepareFailedResponse(error_obj?.message?.data);
  }
};

export const retailerRegisterHandler = async (data: any) => {
  try {
    const resp = await retailerRegister(data);
    return prepareSuccessResponse(resp?.data);
  } catch (error) {
    const error_obj = getHttpErrorMessage(error);
    return prepareFailedResponse(error_obj?.message?.data);
  }
};
