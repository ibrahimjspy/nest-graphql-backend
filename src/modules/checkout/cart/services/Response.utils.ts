import {
  PromiseResolvedEnum,
  ReplaceBundleStatusCodesEnum,
  ReplaceBundleStatusEnum,
  ResponseStatusEnum,
} from './Response.utils.type';

/**
 * @description - this method validates response objects sent by promise.allsettled and returns a string value with status
 * @params response from saleor
 * @params response from marketplace
 * @returns status : "SUCCESS" | "SALEOR_FAILED" | "MARKETPLACE_FAILED" | "FAILED"
 */
export const responseStatusValidate = (saleorResponse, marketplaceResponse) => {
  const { SUCCESS, SALEOR_FAILED, MARKETPLACE_FAILED, FAILED } =
    ResponseStatusEnum;
  const { FULFILLED, REJECTED } = PromiseResolvedEnum;
  if (
    saleorResponse.status == FULFILLED &&
    marketplaceResponse.status == FULFILLED
  ) {
    return SUCCESS;
  }

  if (
    saleorResponse.status == REJECTED &&
    marketplaceResponse.status == FULFILLED
  ) {
    return SALEOR_FAILED;
  }

  if (
    saleorResponse.status == FULFILLED &&
    marketplaceResponse.status == REJECTED
  ) {
    return MARKETPLACE_FAILED;
  }

  return FAILED;
};

/**
 * @description - this method validates response objects sent by promise.allsettled and returns a string value with status
 * @params response from deletePreviousBundle
 * @params response from createNewBundle
 * @returns status : "SUCCESS" | "PREVIOUS_BUNDLE_DELETION_FAILED" | "NEW_BUNDLE_CREATION_FAILED" | "FAILED"
 */
export const replaceBundleStatusValidate = (
  deletePreviousBundle,
  createNewBundle,
) => {
  const {
    REPLACED,
    PREVIOUS_BUNDLE_DELETION_FAILED,
    NEW_BUNDLE_CREATION_FAILED,
    FAILED,
  } = ReplaceBundleStatusEnum;
  const { BAD_REQUEST, UNAUTHORIZED, CREATED } = ReplaceBundleStatusCodesEnum;

  if (
    deletePreviousBundle.status == CREATED &&
    createNewBundle.status == CREATED
  ) {
    return REPLACED;
  }

  if (
    (deletePreviousBundle.status == BAD_REQUEST ||
      deletePreviousBundle.status == UNAUTHORIZED) &&
    createNewBundle.status == CREATED
  ) {
    return PREVIOUS_BUNDLE_DELETION_FAILED;
  }

  if (
    deletePreviousBundle.status == CREATED &&
    (createNewBundle.status == UNAUTHORIZED ||
      createNewBundle.status == BAD_REQUEST)
  ) {
    return NEW_BUNDLE_CREATION_FAILED;
  }

  return FAILED;
};
