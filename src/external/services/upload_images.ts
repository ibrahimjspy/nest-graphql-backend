import { uploadImages } from 'src/external/endpoints/upload_images';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import { getHttpErrorMessage } from 'src/external/utils/httpHelper';

export const uploadImagesHandler = async (file: any) => {
  try {
    const resp = await uploadImages(file);
    return prepareSuccessResponse(resp);
  } catch (error) {
    const error_obj = getHttpErrorMessage(error);
    return prepareFailedResponse(error_obj?.message?.data);
  }
};
