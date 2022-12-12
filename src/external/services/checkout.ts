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
  STORE_CREDIT,
} from 'src/constants';
import { AuthService } from 'src/external/services/auth';
import { getLegacyMappingHandler } from 'src/graphql/handlers/product';
import { hash } from 'src/core/utils/helpers';
import { Logger } from '@nestjs/common';
import { addShippingAddressInfo } from '../endpoints/checkout';

export class LegacyService {
  private readonly logger = new Logger(LegacyService.name);
  selectedBundles: any;
  shipping_info: any;
  BASE_URL: any;
  colorMappingObject = {};
  shopIdList = [];
  productIdList = [];
  stocktypeMapingObject = {};
  categoryMappingObject = {};
  shoeSizeNames = [];
  shoesVendorIds = [];

  constructor(selectedBundles: any, shipping_info: any) {
    this.selectedBundles = selectedBundles;
    this.shipping_info = shipping_info;
    this.BASE_URL = `${BASE_EXTERNAL_ENDPOINT}/api/v3`;
  }

  public async placeExternalOrder() {
    // eslint-disable-next-line no-useless-catch
    try {
      const instance = new AuthService(this.BASE_URL);
      const resp = await instance.getToken(SHAROVE_EMAIL, SHAROVE_PASSWORD);
      const URL = `${this.BASE_URL}/check-out/`;
      const header = {
        headers: { Authorization: resp?.access },
      };
      const payload = await this.getExternalOrderPlacePayload();
      this.logger.log('Placing order on OrangeShine');
      const response = await http.post(URL, payload, header);
      return response?.data;
    } catch (error) {
      this.logger.error(error?.response?.data?.message);
      throw error;
    }
  }

  private async getExternalOrderPlacePayload() {
    let shoe_size_mapping;
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
    // only need to call if shoe exist
    if (this.shoeSizeNames.length > 0) {
      const updated_shoes_vendor_ids = this.replaceShopWithVendorId(
        this.shoesVendorIds,
        shopMappingObject,
      );
      const shoes_mapping_resp = await this.getShoeSizeIDs(
        updated_shoes_vendor_ids,
        this.shoeSizeNames,
      );
      shoe_size_mapping = hash(shoes_mapping_resp?.data, 'name');
    }
    const shippingData = {
      address1: this.shipping_info?.streetAddress1,
      address2: this.shipping_info?.streetAddress2,
      city: this.shipping_info?.city,
      state: this.shipping_info?.countryArea,
      zipcode: this.shipping_info?.postalCode,
    };

    const shippingAddressInfo = await this.getOrCreateShippingAddressID(
      shippingData,
    );

    const payload = this.payloadBuilder(
      productMappingObject,
      color_mapping_response,
      shoe_size_mapping || {},
      shippingAddressInfo,
    );
    const validated_payload = await this.validate_order_quantity(payload);

    this.logger.log('Payload validating');
    // if length of resp is 0, it means payload is valid.
    if (validated_payload?.length > 0) {
      this.logger.warn('Payload validation Failed');
      throw Error(validated_payload);
    }
    return payload;
  }

  protected parseBundleDetails() {
    const bundleList = this.selectedBundles;
    for (let i = 0; i < bundleList.length; i++) {
      const element = bundleList[i];
      const shop_id = element?.bundle?.shop?.id;
      const bundle_name = element?.bundle?.name;
      if (shop_id && !this.shopIdList.includes(shop_id))
        this.shopIdList.push(shop_id);

      this.getVariantDetails(element?.bundle?.variants, shop_id, bundle_name);
    }
  }

  protected async validate_order_quantity(payload) {
    // eslint-disable-next-line no-useless-catch
    try {
      const URL = `${this.BASE_URL}/product/quantity-validator`;
      const response = await http.post(URL, payload);
      return response?.data;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  protected payloadBuilder(
    productMappings,
    colorMappings,
    shoe_size_mapping,
    shippingAddressInfo,
  ) {
    const selectedBundlesData = this.selectedBundles;
    const payloadObject = {};

    selectedBundlesData?.map((elements) => {
      elements?.bundle?.variants?.map((element) => {
        const bundle_name = elements?.bundle?.name;
        const productId = element?.variant?.product?.id;
        const color_id =
          colorMappings[
            this.getColorAttribute(element?.variant?.attributes)?.values[0]
              ?.name
          ]['id'];

        const item_id = productMappings[productId]['legacyProductId'];
        const composite_key = `${item_id}_${color_id}`;

        if (productId && !(composite_key in payloadObject)) {
          const tempObj = {
            item_id: item_id,
            color_id: color_id,
            pack_qty: elements?.quantity,
            stock_type: this.stocktypeMapingObject[productId],

            memo: '',
            sms_number: SMS_NUMBER,
            spa_id: shippingAddressInfo?.data?.id,
            spm_name: 'UPS',
            store_credit: STORE_CREDIT,
            signature_requested: SIGNATURE_REQUESTED === 'true',
          };

          payloadObject[composite_key] =
            this.categoryMappingObject[productId] == CATEGORY_SHOES
              ? { ...tempObj, shoe_size_id: shoe_size_mapping[bundle_name]?.id }
              : tempObj;
        }
      });
    });

    return {
      orders: Object.values(payloadObject),
      payment_type: PAYMENT_TYPE,
      spa_id: parseInt(shippingAddressInfo?.data?.id),
    };
  }

  protected getVariantDetails(variants, shop_id, bundle_name) {
    for (let i = 0; i < variants.length; i++) {
      const product_id = variants[i]?.variant?.product?.id;
      const is_preorder = variants[i]?.variant?.preorder;
      // All variants have same category, So get first one.
      const category_name =
        variants[i]?.variant?.product?.category?.ancestors?.edges[0]?.node
          ?.name;
      // If category is shoes we need to seperately track bundle_name & shop_id
      if (category_name == CATEGORY_SHOES) {
        this.shoeSizeNames.push(bundle_name);
        this.shoesVendorIds.push(shop_id);
      }

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
    // eslint-disable-next-line no-useless-catch
    try {
      const URL = `${
        this.BASE_URL
      }/product/details?color-mapping=${JSON.stringify(colorObject)}`;
      const response = await http.get(URL);
      return hash(response?.data?.data, 'name');
    } catch (error) {
      throw error;
    }
  }

  protected async getShoeSizeIDs(vendor_name_list, shoe_size_name_list) {
    // eslint-disable-next-line no-useless-catch
    try {
      const URL = `${
        this.BASE_URL
      }/product/shoe-sizes?vendor_name_list=${JSON.stringify(
        vendor_name_list,
      )}&shoe_size_name_list=${JSON.stringify(shoe_size_name_list)}`;
      const response = await http.get(URL);
      return response?.data;
    } catch (error) {
      throw error;
    }
  }

  protected async getOrCreateShippingAddressID(shipping_info) {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await addShippingAddressInfo(shipping_info);
      return response;
    } catch (error) {
      throw error;
    }
  }

  protected getColorAttribute(attributes) {
    const result = attributes.filter(function (element) {
      if (element.attribute.name == 'Color') {
        return element;
      }
    });
    return result[0];
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

  protected replaceShopWithVendorId(shop_ids, mapping_object) {
    const vendorIds = shop_ids?.map(function (element) {
      return mapping_object[String(element)]['vendorId'];
    });

    return vendorIds;
  }
}
