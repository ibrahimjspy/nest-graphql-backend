import {
  checkRetailerEmail,
  retailerJobTitles,
  retailerRegister,
  uploadRetailerCertificate,
} from 'src/external/endpoints/retailerRegistration';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import { getHttpErrorMessage } from 'src/external/utils/httpHelper';
import { RetailerRegisterDto } from '../../modules/retailer/dto';

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

export const retailerRegisterHandler = async (data: RetailerRegisterDto) => {
  try {
    const resp = await retailerRegister(data);
    return prepareSuccessResponse(resp?.data);
  } catch (error) {
    const error_obj = getHttpErrorMessage(error);
    return prepareFailedResponse(error_obj?.message?.data);
  }
};
