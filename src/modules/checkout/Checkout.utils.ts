import http from 'src/core/services/http';
import { hash, makeQuantity } from 'src/core/utils/helpers';
import { CheckoutBundleInputType } from 'src/graphql/handlers/checkout.type';
import { BundleType } from 'src/graphql/types/bundle.type';
import { CheckoutBundleType } from './Checkout.utils.type';
import { getAccessToken } from 'src/core/utils/auth';
import { getLegacyProductMappingHandler } from 'src/graphql/handlers/checkout';
/**
 * It takes an array of checkoutBundles and returns an array of product ids
 * @param {any[]} checkoutBundles - any[]
 * @returns An array of product ids from the checkoutBundles
 */
export const getProductIdsByCheckoutBundles = (
  checkoutBundles: any[],
): Array<string> => {
  return checkoutBundles?.reduce((result, bundle) => {
    const variants = bundle['bundle']?.variants;
    if (variants?.length) result.push(variants[0]?.variant?.product?.id);
    return result;
  }, []);
};

/**
 * It takes a list of products and returns a list of all the variants ids
 * @param products - The products object returned from the query.
 * @returns An array of variant ids
 */
export const getVariantsIdsByProducts = (products) => {
  return products?.edges?.reduce((result, product) => {
    const variants: Array<{ id: string }> = product?.node?.variants;
    variants.reduce((_, currValue) => result.push(currValue?.id));
    return result;
  }, []);
};

/**
 * It takes an array of checkout bundles and returns an array of bundle ids
 * @param {any[]} checkoutBundles - any[]
 * @returns An array of strings
 */
export const getCheckoutBundlesIds = (
  checkoutBundles: any[],
): Array<string> => {
  return checkoutBundles?.map((bundle) => bundle['bundle']?.id);
};

/**
 * It takes an array of checkoutBundles and an array of allBundles and returns an array of allBundles
 * that are not in checkoutBundles
 * @param checkoutBundles - Array<any>
 * @param allBundles - Array<any> - this is the list of all bundles that are available to be added to
 * the cart.
 * @returns An array of objects with the following properties:
 *   checkoutBundleId: string
 *   isSelected: boolean
 *   quantity: number
 *   in_checkout: boolean
 *   bundle: object
 */
export const getBundlesNotInCheckout = (
  checkoutBundles: Array<any>,
  allBundles: Array<any>,
): Array<any> => {
  if (checkoutBundles.length == 0) return [];
  const checkoutBundlesIds = getCheckoutBundlesIds(checkoutBundles);

  return allBundles?.reduce((result, bundle: { id: string }) => {
    if (!checkoutBundlesIds.includes(bundle.id)) {
      result.push({
        checkoutBundleId: '',
        isSelected: false,
        quantity: 0,
        bundle,
      });
    }
    return result;
  }, []);
};

/**
 * returns line items (for saleor apis)
 * @params bundles: all bundles array in the checkout
 * @params targetBundles: bundles array for which we need line items
 */
export const getLineItems = async (bundles, targetBundles) => {
  const lines: Array<{ quantity: number; variantId: string }> = [];
  bundles.forEach((bundle) => {
    const targetBundle = (targetBundles || []).find(
      (a) => a?.bundleId === bundle?.id,
    );

    // Bundle quantity is multiplied with variant quantity for getting actual quantity ordered by user
    const bundleQty = targetBundle?.quantity;
    bundle?.variants?.forEach((v) =>
      lines.push({
        quantity: bundleQty * v?.quantity,
        variantId: v?.variant?.id,
      }),
    );
  });
  return lines;
};

/**
 * returns line items with updated quantity
 * @params lines: checkout lines from saleor checkout
 * @params checkoutBundles: all the bundles array from the checkout data
 * @params bundlesFromCart: bundles from cart for which update (i.e quantity or color) is required
 */
export const getUpdatedLinesWithQuantity = (
  lines,
  checkoutBundles,
  bundlesFromCart,
) => {
  const quantity = bundlesFromCart[0]?.quantity;
  const checkoutBundleIds = bundlesFromCart.map((bundle) => bundle?.bundleId);

  const checkoutLines = getCheckoutLineItems(
    lines,
    checkoutBundles,
    checkoutBundleIds,
  );

  return (checkoutLines || []).map((line) => ({
    variantId: line?.variantId,
    quantity: line?.quantity * quantity,
  }));
};

/**
 * It takes a list of bundles, a list of bundles for cart, and a new checkout object, and returns a
 * list of bundles for cart with line ids
 * @param {BundleType[]} bundlesList - this is the list of bundles that are selected by
 * the user and fetched from bundle Service.
 * @param {CheckoutBundleInputType[]} bundlesForCart - This is the array of bundles that we want to add
 * to the cart without lineIds.
 * @param newCheckout - The new checkout object that is returned from the server after the checkout is
 * created.
 * @returns An array of CheckoutBundleInputType
 */
export const getBundlesWithLineIds = (
  bundlesList: BundleType[],
  bundlesForCart: CheckoutBundleInputType[],
  newCheckout,
): CheckoutBundleInputType[] => {
  // convert bundlesForCart into hash
  const bundlesForCartHash = hash(
    bundlesForCart,
    (ele: CheckoutBundleInputType) => ele.bundleId,
  );

  // iterate over all selected bundles
  bundlesList.forEach((bundle) => {
    bundlesForCartHash[bundle.id].lines = [];
    // iterate over all selected bundle's variants
    bundle.variants?.forEach((variant) => {
      const line = (newCheckout?.checkout?.lines || []).find(
        (line) => line?.variant?.id == variant?.variant?.id,
      );

      // add line ids to bundlesForCart
      bundlesForCartHash[bundle.id].lines.push(line?.id);
    });
  });

  return Object.values(bundlesForCartHash);
};

/**
 * returns particular bundle for which is updated (i.e select/ unselect/ delete)
 * @params bundles: all the bundles array from the checkout data
 * @params bundleId: bundle id (string or array) against which the target bundle will be searched
 */
export const getTargetBundleByBundleId = (bundles, bundleId) => {
  if (Array.isArray(bundleId)) {
    return (bundles || []).filter((bundle) => {
      return bundleId.includes(bundle?.bundle?.id);
    });
  } else {
    return (bundles || []).filter((bundle) => bundleId === bundle?.bundle?.id);
  }
};

/**
 * returns particular bundle for which is updated (i.e select/ unselect/ delete)
 * @params bundles: all the bundles array from the checkout data
 * @params checkoutBundleIds: checkout bundle id (string or array) against which the target bundle will be searched
 */
export const getTargetBundleByCheckoutBundleId = (
  bundles,
  checkoutBundleIds,
) => {
  if (Array.isArray(checkoutBundleIds)) {
    return (bundles || []).filter((bundle) => {
      return checkoutBundleIds.includes(bundle?.checkoutBundleId);
    });
  } else {
    return (bundles || []).filter(
      (bundle) => checkoutBundleIds === bundle?.checkoutBundleId,
    );
  }
};

/**
 * returns array of variant ids from the target bundles
 * @params targetBundles: complete arget bundles array consisting of variants info
 */
export const getVariantIds = (targetBundles) => {
  const variantIds = [];
  (targetBundles || []).forEach((bundlesObj) => {
    bundlesObj?.bundle?.variants.forEach((variant) =>
      variantIds.push(variant?.variant?.id),
    );
  });
  return variantIds;
};

/**
 * returns line items array for saleor api
 * @params lines: checkout lines from saleor checkout
 * @params bundles: all the bundles array from the checkout data
 * @params bundleIds: array of bundle ids
 */
export const getCheckoutLineItems = (lines, bundles, bundleIds) => {
  const targetBundle = getTargetBundleByBundleId(bundles, bundleIds);
  const variantIds = getVariantIds(targetBundle);

  return (lines || [])
    .filter((line) => variantIds.includes(line?.variant?.id))
    .map((line) => ({
      variantId: line?.variant?.id,
      quantity: line?.quantity,
    }));
};

/**
 * returns line items array for saleor api
 * @params lines: checkout lines from saleor checkout
 * @params bundles: all the bundles array from the checkout data
 * @params checkoutBundleIds: array of checkout bundle ids
 */
export const getCheckoutLineItemsForDelete = (
  lines,
  bundles,
  checkoutBundleIds,
) => {
  const targetBundle = getTargetBundleByCheckoutBundleId(
    bundles,
    checkoutBundleIds,
  );
  const variantIds = getVariantIds(targetBundle);

  return (lines || [])
    .filter((line) => variantIds.includes(line?.variant?.id))
    .map((line) => ({
      lineId: line?.id,
      quantity: line?.quantity,
    }));
};

/**
 * returns line items array for saleor api
 * @params checkoutLines: checkout lines from saleor checkout
 * @returns array of checkoutLineIds
 */
export const getCheckoutLineIds = (checkoutLines = []) => {
  return checkoutLines.map((l: any) => l?.id || l?.lineId);
};

/**
 * returns bundle object with updated selection object and limited info (i.e bundleId, quantity, isSelected)
 * @params bundles: all the bundles array from the checkout data
 * @params bundleIds: array of bundle ids
 * @params isSelected: flag to check if bundle is selected for checkout or not
 */
export const selectOrUnselectBundle = (
  bundles,
  bundleIds: Array<string>,
  isSelected: boolean,
) => {
  const targetBundle = getTargetBundleByBundleId(bundles, bundleIds);
  return (targetBundle || []).map((bundle) => ({
    bundleId: bundle?.bundle?.id,
    quantity: bundle?.quantity,
    isSelected,
  }));
};

/**
 * returns already added bundles in cart with updated quantity
 * @params existedCheckoutBundles: all the bundles array from the checkout data
 * @params bundlesFromCart: bundles from cart which are again added to cart
 */
export const updateBundlesQuantity = async (
  existedCheckoutBundles: CheckoutBundleType[],
  bundlesFromCart: CheckoutBundleInputType[],
) => {
  return bundlesFromCart.map((bundle) => {
    const existedBundle = existedCheckoutBundles.find(
      (checkoutBundle) => checkoutBundle?.bundle?.id === bundle?.bundleId,
    );

    if (existedBundle) {
      const oldQuantity = makeQuantity(existedBundle?.quantity);
      const newQuantity = makeQuantity(bundle?.quantity);
      return { ...bundle, quantity: oldQuantity + newQuantity };
    }
    return bundle;
  });
};

/**
 * returns available shipping methods from different shops
 * @params bundles: all the bundles array from the checkout data
 */
export const getShippingMethods = (bundles = []) => {
  let shippingMethods = [];
  bundles.forEach((bundle: CheckoutBundleType) => {
    shippingMethods = [
      ...shippingMethods,
      ...(bundle?.bundle?.shop?.shippingMethods || []),
    ];
  });
  return shippingMethods;
};

/**
 * returns shipping methods from shop service mapped with shipping methods from saleor api
 * @params methods: shipping methods from saleor
 * @params shippingMethodsFromShopService: shipping methods from shop service
 * @params selectedMethods: shipping method ids selected by user
 */
export const getShippingMethodsWithUUID = (
  methods,
  shippingMethodsFromShopService,
  selectedMethods,
) => {
  const selectedMethodsId = selectedMethods.map(
    (shippingMethod) => shippingMethod?.method?.shippingMethodTypeId,
  );
  const getUUID = (id) => {
    const sameMethod = (shippingMethodsFromShopService || []).find(
      (method) => method?.shippingMethodTypeId === id,
    );
    return sameMethod?.id;
  };

  return (methods || []).map((method) => {
    const shippingMethodId = getUUID(method?.id);
    if (selectedMethodsId.includes(method?.id)) {
      return {
        ...method,
        shippingMethodId,
        isSelected: true,
      };
    } else {
      return {
        ...method,
        shippingMethodId,
        isSelected: false,
      };
    }
  });
};

/**
 * returns selected bundles from all bundles list
 * @params bundles: all the bundles array from the checkout data
 */
export const getSelectedBundles = (bundles) => {
  return (bundles || []).filter((bundle) => bundle?.isSelected);
};

/**
 * returns array of checkoutBundleIds from bundles list (bundleId is different from checkoutBundleId)
 * @params bundles: all the bundles array from the checkout data
 */
export const getCheckoutBundleIds = (bundles) => {
  return (bundles || []).map((bundle) => bundle?.checkoutBundleId);
};

/**
 * returns dummy payment gateway for testing purpose
 * @params paymentGateways: available payment gateways
 */
export const getDummyGateway = (availablePaymentGateways = []) => {
  const dummyGateway = (availablePaymentGateways || []).find(
    (gateway) => gateway?.name === 'Dummy',
  );
  return dummyGateway?.id;
};

export const getShippingMethodsFromShippingZones = (shippingZones) => {
  let shippingMethods = [];
  shippingZones.forEach((shippingZone) => {
    shippingMethods = [
      ...shippingMethods,
      ...shippingZone?.node?.shippingMethods,
    ];
  });
  return shippingMethods;
};

/**
 * It takes in an array of selected bundles, gets the access token, gets the payload, and then makes a
 * post request to the external endpoint
 * @param selectedBundles - An array of objects containing the selected bundles.
 * @returns The response from the external API.
 */
export const externalOrderPlace = async (selectedBundles) => {
  const auth_resp = await getAccessToken();
  const URL = `${process.env.EXTERNAL_ENDPOINT}/api/v3/check-out/`;
  const header = {
    headers: { Authorization: auth_resp?.data?.access },
  };
  const payload = await getExternalOrderPlacePayload(selectedBundles);
  const response = await http.post(URL, payload, header);

  return response;
};

/**
 * It takes a string, splits it into an array of words, capitalizes the first letter of each word, and
 * then joins the array back into a string
 * @param color_name - The name of the color.
 * @returns A string with the first letter of each word capitalized.
 */
const titleString = (color_name) => {
  if (color_name) {
    const titleColorName = color_name
      .split(' ')
      .map((word) => word[0].toUpperCase() + word.substring(1).toLowerCase())
      .join(' ');

    return titleColorName;
  }

  return color_name;
};

/**
 * It takes an object with an array of objects as a property, and returns an object with the name of
 * each object in the array as a property, and the id of each object in the array as the value of the
 * property
 * @param data - The data returned from the API call.
 * @returns An object with the color name as the key and the color id as the value.
 */
const mapColorNameWithColorID = (data) => {
  const mappingObject = {};
  data?.data?.map(function (element) {
    if (!(element?.name in mappingObject)) {
      mappingObject[element?.name] = element?.id;
    }
  });
  return mappingObject;
};

/**
 * It takes an array of objects and returns an object with the keys being the legacyProductIds and the
 * values being the currentProductIds
 * @param elements - The array of objects that you want to map.
 * @returns An object with the key being the legacyProductId and the value being the currentProductId
 */
const mapCurrentProductIDswithLegacyProductIds = (elements) => {
  const mappingObject = {};
  elements?.map((element) => {
    if (!(element?.sourceId in mappingObject))
      mappingObject[element.legacyProductId] = element.currentProductId;
  });
  return mappingObject;
};

/**
 * It takes in an array of selectedBundles, and returns an object that contains the product IDs, color
 * IDs, and color names of the selectedBundles
 * @param selectedBundles - The selected bundles from the checkout page.
 * @returns a payload object.
 */
const getExternalOrderPlacePayload = async (selectedBundles) => {
  const currentProductIDs = getProductIdsByCheckoutBundles(selectedBundles);
  const colorNames = getColorNamesByCheckoutBundles(selectedBundles);

  const colorResponse = await getLegacyColorMappingIDs(colorNames);
  const productMappingResponse = await getLegacyProductMappingHandler(
    currentProductIDs,
  );
  const payload = payloadBuilder(
    selectedBundles,
    colorResponse,
    productMappingResponse,
  );

  return payload;
};

/**
 * It takes an array of color names and returns an object with color names as keys and color IDs as
 * values
 * @param colorNames - An array of color names.
 * @returns An object with color names as keys and color IDs as values.
 */
const getLegacyColorMappingIDs = async (colorNames) => {
  const URL = `${
    process.env.EXTERNAL_ENDPOINT
  }/api/v3/product/details?${queryParamsBuilder(colorNames)}`;

  const response = await http.get(URL);
  return mapColorNameWithColorID(response?.data);
};

/**
 * It takes an array of strings and returns a string that can be used as a query parameter
 * @param elements - An array of strings that represent the colors you want to search for.
 * @returns A string of query parameters
 */
const queryParamsBuilder = (elements) => {
  let queryString = '';
  elements.map(function (colorName) {
    queryString
      ? (queryString += `&colors=${colorName}`)
      : (queryString += `colors=${colorName}`);
  });

  return queryString;
};

/**
 * It takes an array of checkoutBundles and returns an array of colorNames
 * @param {any[]} checkoutBundles - This is the array of checkout bundles that you get from the
 * checkout API.
 * @returns An array of color names
 */
const getColorNamesByCheckoutBundles = (checkoutBundles: any[]) => {
  const colorNames = [];
  checkoutBundles?.map(function (element) {
    const variants = element['bundle']?.variants;
    variants?.map(function (varient_element) {
      const colorName =
        varient_element?.variant?.attributes[0]?.values[0]?.name;
      const titleColorName = titleString(colorName);
      if (!colorNames.includes(titleColorName)) colorNames.push(titleColorName);
    });
  });
  return colorNames;
};

/**
 * It takes in the raw data, color mappings and product mapping and returns a payload object
 * @param raw_data - This is the raw data that you get from the Bundle Service.
 * @param color_mappings - This is a mapping of the color names to the color IDs.
 * @param product_mapping - This is the mapping of the current product ID with the legacy product ID.
 * @returns An object with two keys: orders and payment_type.
 */
const payloadBuilder = (raw_data, color_mappings, product_mapping) => {
  const payloadObject = {};
  const productMappings = mapCurrentProductIDswithLegacyProductIds(
    product_mapping?.productMapping,
  );

  raw_data?.map((elements) => {
    elements?.bundle?.variants?.map((element) => {
      const productId = element?.variant?.product?.id;
      const colorName = titleString(
        element?.variant?.attributes[0]?.values[0]?.name,
      );

      if (productId) {
        if (!(productId in payloadObject)) {
          payloadObject[productId] = {
            item_id: productMappings[productId],
            color_id: color_mappings[colorName] || 1, // TODO: Need to verify from Ibrahim.
            pack_qty: elements?.quantity,
            stock_type: 'in_stock',
            exp_shipout_date: '2022-05-21',
            // TODO: Need to verify thee fields
            memo: '',
            sms_number: process.env.SMS_NUMBER,
            spa_id: process.env.SPA_ID,
            spm_id: process.env.SPM_ID,
            store_credit: process.env.STORE_CREDIT,
            signature_requested: process.env.SIGNATURE_REQUESTED,
          };
        }
      }
    });
  });

  return {
    orders: Object.values(payloadObject),
    payment_type: process.env.PAYMENT_TYPE,
  };
};
