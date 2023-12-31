import { uploadImages } from 'src/external/endpoints/uploadImages';
import { prepareFailedResponse } from 'src/core/utils/response';
import { getHttpErrorMessage } from 'src/external/utils/httpHelper';

export const uploadImagesHandler = async (file: any, bucket: string) => {
  try {
    const resp = await uploadImages(file, bucket);
    return resp;
  } catch (error) {
    const error_obj = getHttpErrorMessage(error);
    return prepareFailedResponse(error_obj?.message?.data);
  }
};
