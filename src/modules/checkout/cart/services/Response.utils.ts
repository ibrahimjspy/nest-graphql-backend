/**
 * @description - this method validates response objects sent by promise.allsettled and returns a string value with status
 * @params response from saleor
 * @params response from marketplace
 * @returns status : "SUCCESS" | "SALEOR_FAILED" | "MARKETPLACE_FAILED" | "FAILED"
 */
export const responseStatusValidate = (saleorResponse, marketplaceResponse) => {
  if (
    saleorResponse.status == 'fulfilled' &&
    marketplaceResponse.status == 'fulfilled'
  ) {
    return 'SUCCESS';
  }

  if (
    saleorResponse.status == 'rejected' &&
    marketplaceResponse.status == 'fulfilled'
  ) {
    return 'SALEOR_FAILED';
  }

  if (
    saleorResponse.status == 'fulfilled' &&
    marketplaceResponse.status == 'rejected'
  ) {
    return 'MARKETPLACE_FAILED';
  }

  if (
    saleorResponse.status == 'rejected' &&
    marketplaceResponse.status == 'rejected'
  ) {
    return 'FAILED';
  }
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
  if (deletePreviousBundle.status == '201' && createNewBundle.status == '201') {
    return 'SUCCESS';
  }

  if (
    (deletePreviousBundle.status == '400' ||
      deletePreviousBundle.status == '401') &&
    createNewBundle.status == '201'
  ) {
    return 'PREVIOUS_BUNDLE_DELETION_FAILED';
  }

  if (
    deletePreviousBundle.status == '201' &&
    (createNewBundle.status == '401' || createNewBundle.status == '400')
  ) {
    return 'NEW_BUNDLE_CREATION_FAILED';
  }

  if (deletePreviousBundle.status == '401' && createNewBundle.status == '401') {
    return 'FAILED';
  }
};
