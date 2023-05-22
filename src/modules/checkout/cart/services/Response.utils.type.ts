export enum ResponseStatusEnum {
  'SUCCESS' = 'SUCCESS',
  'FAILED' = 'FAILED',
  'MARKETPLACE_FAILED' = 'MARKETPLACE_FAILED',
  'SALEOR_FAILED' = 'SALEOR_FAILED',
}

export enum ReplaceBundleStatusEnum {
  'REPLACED' = 'REPLACED',
  'FAILED' = 'FAILED',
  'PREVIOUS_BUNDLE_DELETION_FAILED' = 'PREVIOUS_BUNDLE_DELETION_FAILED',
  'NEW_BUNDLE_CREATION_FAILED' = 'NEW_BUNDLE_CREATION_FAILED',
}

export enum PromiseResolvedEnum {
  'REJECTED' = 'rejected',
  'FULFILLED' = 'fulfilled',
}

export enum ReplaceBundleStatusCodesEnum {
  'BAD_REQUEST' = '400',
  'UNAUTHORIZED' = '401',
  'CREATED' = '201',
  'OK' = '200',
}
