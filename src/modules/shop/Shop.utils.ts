/**
 * validates whether an input is an array, if not return an array with single element
 */
export const validateArray = (input) => {
  return input.map ? input : Array(input);
};

/**
 * @description : take shop fields and returns values of that field in shop
 */
export const getFieldValues = (
  fields: Array<{ name: string; values: string[] }>,
  fieldName: string,
): string[] => {
  let fieldValues = [];
  if (fields.map) {
    fields.map((field) => {
      if (field.name == fieldName) {
        fieldValues = field.values;
      }
    });
  }
  return fieldValues;
};

/**
 * take shop fields and returns vendor ids in an array
 */
export const getMyVendorsFieldValues = (fields) => {
  let myVendorIds = [];
  if (fields.map) {
    fields.map((field) => {
      if (field.name == 'myvendors') {
        myVendorIds = field.values;
      }
    });
  }
  return myVendorIds;
};
/**
 * returns with fields array
 * @params shop: information for shop creation
 */
export const validateStoreInput = (storeInput) => {
  return {
    ...storeInput,
    user: storeInput['email'],
    description: storeInput['description'] || '',
    about: storeInput['about'] || '',
    madeIn: storeInput['madeIn'] || '',
    minOrder: storeInput['minOrder'] || 0,
    returnPolicy: storeInput['returnPolicy'] || '',
    storePolicy: storeInput['storePolicy'] || '',
    logo: storeInput['logo'] || '',
    banner: storeInput['banner'] || '',
    facebook: storeInput['facebook'] || '',
    pinterest: storeInput['pinterest'] || '',
    instagram: storeInput['instagram'] || '',
    twitter: storeInput['twitter'] || '',
  };
};

/**
 * this function adds shop total products count to our response
 */
export const makeMyProductsResponse = (productsData, storeFrontDetails) => {
  productsData.totalCount = storeFrontDetails.totalCount;
  productsData.pageInfo = storeFrontDetails.pageInfo;
  return productsData;
};
