import { retailerJobTitles } from 'src/external/endpoints/retailers_registration';
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
