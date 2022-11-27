import http from 'src/core/proxies/restHandler';
import {
  BASE_EXTERNAL_ENDPOINT,
  CATEGORY_SHOES,
  IN_STOCK,
  PAYMENT_TYPE,
  PRE_ORDER,
  SHAROVE_EMAIL,
  SHAROVE_PASSWORD,
  SIGNATURE_REQUESTED,
  SMS_NUMBER,
  SPA_ID,
  SPM_ID,
  STORE_CREDIT,
} from 'src/constants';
import { AuthService } from 'src/core/services/auth';
import { getLegacyMappingHandler } from 'src/graphql/handlers/checkout';
import { hash } from 'src/core/utils/helpers';

export class LegacyService {
  selectedBundles: any;
  colorMappingObject = {};
  shopIdList = [];
  productIdList = [];
  stocktypeMapingObject = {};
  categoryMappingObject = {};

  constructor(selectedBundles: any) {
    this.selectedBundles = selectedBundles;
  }

  public async placeExternalOrder() {
    const instance = new AuthService(BASE_EXTERNAL_ENDPOINT);
    const resp = await instance.getToken(SHAROVE_EMAIL, SHAROVE_PASSWORD);
    const URL = `${BASE_EXTERNAL_ENDPOINT}/api/v3/check-out/`;
    const header = {
      headers: { Authorization: resp?.access },
    };
    const payload = await this.getExternalOrderPlacePayload();
    const response = await http.post(URL, payload, header);
    return response?.data;
  }

  private async getExternalOrderPlacePayload() {
    this.parseBundleDetails();

    const graphqlResponse = await getLegacyMappingHandler(
      this.productIdList,
      this.shopIdList,
    );

    const productMappingObject = hash(
      graphqlResponse?.productMapping,
      'productId',
    );

    const shopMappingObject = hash(graphqlResponse?.shopMapping, 'shopId');
    const updated_color_mapping = this.swapShopIdWithVendorId(
      this.colorMappingObject,
      shopMappingObject,
    );

    const color_mapping_response = await this.getLegacyColorMappingIDs(
      updated_color_mapping,
    );

    const payload = this.payloadBuilder(
      productMappingObject,
      color_mapping_response,
    );

    return payload;
  }

  protected parseBundleDetails() {
    const bundleList = this.selectedBundles;

    for (let i = 0; i < bundleList.length; i++) {
      const element = bundleList[i];
      const shop_id = element?.bundle?.shop?.id;
      if (shop_id && !this.shopIdList.includes(shop_id))
        this.shopIdList.push(shop_id);

      this.getVariantDetails(element?.bundle?.variants, shop_id);
    }
  }

  protected payloadBuilder(productMappings, colorMappings) {
    const selectedBundlesData = this.selectedBundles;
    const payloadObject = {};

    selectedBundlesData?.map((elements) => {
      elements?.bundle?.variants?.map((element) => {
        const productId = element?.variant?.product?.id;
        const color_id =
          colorMappings[element?.variant?.attributes[0]?.values[0]?.name]['id'];
        const item_id = productMappings[productId]['legacyProductId'];
        const composite_key = `${item_id}_${color_id}`;

        if (productId && !(composite_key in payloadObject)) {
          const tempObj = {
            item_id: item_id,
            color_id: color_id,
            pack_qty: elements?.quantity,
            stock_type: this.stocktypeMapingObject[productId],
            exp_shipout_date: '2022-05-21',

            memo: '',
            sms_number: SMS_NUMBER,
            spa_id: SPA_ID,
            spm_id: SPM_ID,
            store_credit: STORE_CREDIT,
            signature_requested: SIGNATURE_REQUESTED,
          };

          /**
           * TODO: Need to swap this hard-coded shoe_size_id.
           * Added this only to complete the flow. Once added mapping in cdc this will be replaced.
           */
          payloadObject[composite_key] =
            this.categoryMappingObject[productId] == CATEGORY_SHOES
              ? { ...tempObj, shoe_size_id: 23 }
              : tempObj;
        }
      });
    });

    return { orders: Object.values(payloadObject), payment_type: PAYMENT_TYPE };
  }

  protected getVariantDetails(variants, shop_id) {
    for (let i = 0; i < variants.length; i++) {
      const product_id = variants[i]?.variant?.product?.id;
      const is_preorder = variants[i]?.variant?.preorder;
      // All variants have same category, So get first one.
      const category_name =
        variants[i]?.variant?.product?.category?.ancestors?.edges[0]?.node
          ?.name;

      if (product_id && !this.productIdList.includes(product_id))
        this.productIdList.push(product_id);

      if (product_id && !(product_id in this.stocktypeMapingObject))
        this.stocktypeMapingObject[product_id] = is_preorder
          ? PRE_ORDER
          : IN_STOCK;

      if (
        product_id &&
        category_name &&
        !(product_id in this.categoryMappingObject)
      )
        this.categoryMappingObject[product_id] = category_name;

      this.getColorName(variants[i]?.variant?.attributes, shop_id);
    }
  }

  protected async getLegacyColorMappingIDs(colorObject) {
    const URL = `${BASE_EXTERNAL_ENDPOINT}/api/v3/product/details?color-mapping=${JSON.stringify(
      colorObject,
    )}`;
    const response = await http.get(URL);
    return hash(response?.data?.data, 'name');
  }

  protected getColorName(elements, shop_id) {
    const localArray = [];

    elements?.map(function (attributes) {
      if (attributes?.attribute?.name == 'Color') {
        attributes?.values?.map(function (color_name) {
          const name = color_name?.name;
          if (!localArray.includes(name)) localArray.push(name);
        });
      }
    });

    // Collect all colors against shop id and store it as key value pair.
    if (localArray.length > 0) {
      try {
        const previous_array = this.colorMappingObject[shop_id];
        this.colorMappingObject[shop_id] = [
          ...new Set([...previous_array, ...localArray]),
        ];
      } catch (err) {
        // If no prev_array exist create a new one.
        this.colorMappingObject[shop_id] = localArray;
      }
    }
  }

  protected swapShopIdWithVendorId(color_objects, mapping_object) {
    const updated_mapping_object = {};

    for (const key in color_objects) {
      const mapping_key = mapping_object[key]['vendorId'];
      updated_mapping_object[mapping_key] = color_objects[key];
    }

    return updated_mapping_object;
  }
}
