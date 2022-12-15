import { downloadProductImages } from 'src/external/endpoints/download_images';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import { getHttpErrorMessage } from 'src/external/utils/httpHelper';

export const downloadProductImagesHandler = async (images_url) => {
  try {
    const resp = await downloadProductImages(images_url);
    return prepareSuccessResponse(resp?.data);
  } catch (error) {
    const error_obj = getHttpErrorMessage(error);
    return prepareFailedResponse(error_obj?.message?.data);
  }
};
