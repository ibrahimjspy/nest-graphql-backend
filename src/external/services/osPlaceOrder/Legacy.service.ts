import http from 'axios';
import jwt_decode from 'jwt-decode';
import {
  BASE_EXTERNAL_ENDPOINT,
  CATEGORY_SHOES,
  ELASTIC_SEARCH_ENDPOINT,
  IN_STOCK,
  MAPPING_SERVICE_TOKEN,
  PAYMENT_TYPE,
  PRE_ORDER,
  SIGNATURE_REQUESTED,
  SMS_NUMBER,
  STORE_CREDIT,
} from '../../../constants';
import { hash } from 'src/core/utils/helpers';
import { addShippingAddressInfo } from 'src/external/endpoints/checkout';
import axios from 'axios';
import { Logger } from '@nestjs/common';
import { prepareFailedResponse } from 'src/core/utils/response';

// TODO refactor this class implementation according to nest js classes
// TODO split down classes based on external services like mapping, os
// TODO add test cases for transformer methods
// TODO add documemtaton for class methods
export class LegacyService {
  selectedBundles: any;
  shipping_info: any;
  orderId: any;
  BASE_URL: any;
  Elastic_ClOUD_URL: any;
  colorMappingObject = {};
  shopIdList = [];
  productIdList = [];
  osProductList = [];
  osShopIdList = [];
  stockTypeMappingObject = {};
  categoryMappingObject = {};
  shoeSizeNames = [];
  shoesVendorIds = [];
  user_id: string;
  token: string;
  paymentMethodId: string;
  colorsByShops: any[];

  constructor(selectedBundles, shipping_info, orderId, paymentMethodId, token) {
    this.selectedBundles = selectedBundles;
    this.shipping_info = shipping_info;
    this.orderId = orderId;
    this.paymentMethodId = paymentMethodId;
    this.token = token;
    this.BASE_URL = `${BASE_EXTERNAL_ENDPOINT}/api/v3`;
    this.Elastic_ClOUD_URL = `${ELASTIC_SEARCH_ENDPOINT}/api/as/v1`;
  }
  async placeExternalOrder() {
    try {
      const payload = await this.getExternalOrderPlacePayload();
      const URL = `${this.BASE_URL}/check-out/`;
      const tokenWithoutBearer = this.token.match(/^(\S+)\s(.*)/).slice(1);
      const header = {
        headers: { Authorization: tokenWithoutBearer[1] },
      };
      const response = await http.post(URL, payload, header);
      return response?.data;
    } catch (err) {
      Logger.error(err);
      return prepareFailedResponse(err.message);
    }
  }

  async getExternalOrderPlacePayload() {
    let shoe_size_mapping;
    const decodedToken = jwt_decode(this.token);
    this.user_id = decodedToken['os_user_id'];
    this.shopIdList = [];
    this.productIdList = [];
    this.stockTypeMappingObject = {};
    this.categoryMappingObject = {};
    this.colorMappingObject = {};
    this.osProductList = [];
    this.osShopIdList = [];
    this.shoeSizeNames = [];
    this.colorsByShops = [];

    this.parseBundleDetails(); //fixed
    await Promise.all([
      this.GetShop_MappingidsFrom_Elastic_search(),
      this.GetProduct_MappingIdsFrom_Elastic_search(),
    ]);
    const productMappingObject = hash(this.osProductList, 'productId');

    const shopMappingObject = hash(this.osShopIdList, 'shopId');
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
      state: this.shipping_info?.country.code,
      zipcode: this.shipping_info?.postalCode,
      user_id: this.user_id,
      company_name: this.shipping_info?.companyName,
      country: this.shipping_info?.country.code,
      first_name: this.shipping_info?.firstName,
      last_name: this.shipping_info?.lastName,
      nick_name: this.shipping_info?.firstName,
      phone_number: this.shipping_info?.phone,
    };

    const shippingAddressInfo = await this.createOsShippingAddress(
      shippingData,
    );

    const payload = this.payloadBuilder(
      productMappingObject,
      color_mapping_response,
      shoe_size_mapping || {},
      shippingAddressInfo,
    );
    const validated_payload = await this.validate_order_quantity(payload);

    // if length of resp is 0, it means payload is valid.
    if (validated_payload?.length > 0) {
      throw Error(validated_payload);
    }
    return payload;
  }

  parseBundleDetails() {
    const bundleList = this.selectedBundles;

    for (let i = 0; i < bundleList.length; i++) {
      const element = bundleList[i];

      const shop_id = element?.bundle?.shop?.id;
      const bundle_name = element?.bundle?.name;
      const product_id = element?.bundle?.product?.id;
      if (shop_id && !this.shopIdList?.includes(shop_id))
        this.shopIdList.push(shop_id);
      this.productIdList.push(product_id);
      this.getVariantDetails(
        element?.bundle?.productVariants,
        shop_id,
        bundle_name,
        product_id,
      );
    }
  }

  async GetProduct_MappingIdsFrom_Elastic_search() {
    const bundleList = this.selectedBundles;
    const res = await Promise.all(
      bundleList.map(async (item) => {
        const payload = {
          query: '',
          filters: {
            all: [
              {
                shr_b2b_product_id: item?.bundle?.product?.id,
              },
            ],
          },
        };

        const URL = `${this.Elastic_ClOUD_URL}/engines/b2b-product-track-dev/search`;
        const response = await http.post(URL, payload, {
          headers: {
            Authorization: `Bearer private-${MAPPING_SERVICE_TOKEN}`,
          },
        });

        return response?.data.results[0];
      }),
    );

    for (let index = 0; index < res.length; index++) {
      const obj = {
        productId: res[index].shr_b2b_product_id.raw,
        legacyProductId: res[index].os_product_id.raw,
      };
      this.osProductList.push(obj);
    }
  }

  async GetShop_MappingidsFrom_Elastic_search() {
    const bundleList = this.selectedBundles;
    const res = await Promise.all(
      bundleList.map(async (item) => {
        const payload = {
          query: '',
          filters: {
            all: [
              {
                shr_shop_id: item?.bundle?.shop?.id,
              },
            ],
          },
        };

        const URL = `${this.Elastic_ClOUD_URL}/engines/b2b-shop-track-dev/search`;
        const response = await http.post(URL, payload, {
          headers: {
            Authorization: `Bearer private-${MAPPING_SERVICE_TOKEN}`,
          },
        });
        return response?.data.results[0];
      }),
    );
    for (let index = 0; index < res.length; index++) {
      const obj = {
        shopId: res[index].shr_shop_id.raw,
        vendorId: res[index].os_vendor_id.raw,
      };
      this.osShopIdList.push(obj);
    }
  }

  async validate_order_quantity(payload) {
    const URL = `${this.BASE_URL}/product/quantity-validator`;
    const response = await http.post(URL, payload);
    return response?.data;
  }

  payloadBuilder(
    productMappings,
    colorMappings,
    shoe_size_mapping,
    shippingAddressInfo,
  ) {
    const selectedBundlesData = this.selectedBundles;
    const payloadObject = {};

    selectedBundlesData?.map((elements) => {
      const shopId = elements.bundle.shop.id;
      elements?.bundle?.productVariants?.map((element) => {
        const colorName = this.getColorAttribute(
          element?.productVariant?.attributes,
        )?.values[0]?.name;
        const osShopId = this.getOsShopIdByShrShopId(this.osShopIdList, shopId);
        const colorId = this.getColorIdFromColorsList(
          this.colorsByShops,
          colorName,
          osShopId,
        );

        const bundle_name = elements?.bundle?.name;
        const productId = elements?.bundle?.product?.id;

        const item_id = productMappings[productId]['legacyProductId'];
        const composite_key = `${item_id}_${colorId}`;
        if (productId && !(composite_key in payloadObject)) {
          const tempObj = {
            item_id: item_id,
            color_id: colorId,
            pack_qty: elements?.quantity,
            stock_type: this.stockTypeMappingObject[productId],

            memo: '',
            sms_number: SMS_NUMBER,
            spa_id: shippingAddressInfo?.data?.user_id,
            //  shippingAddressInfo?.data?.id,
            spm_name: 'UPS',
            store_credit: STORE_CREDIT,
            signature_requested: SIGNATURE_REQUESTED,
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
      spa_id: parseInt(shippingAddressInfo?.data?.user_id),
      sharove_order_id: this.orderId,
      stripe_payment_method_id: this.paymentMethodId,
    };
  }

  getVariantDetails(variants, shop_id, bundle_name, productId) {
    for (let i = 0; i < variants.length; i++) {
      const product_id = productId;
      const is_preorder = variants[i]?.productVariant?.preorder;
      // All variants have same category, So get first one.
      const category_name =
        variants[i]?.productVariant?.product?.category?.ancestors?.edges[0]
          ?.node?.name;
      // If category is shoes we need to seperately track bundle_name & shop_id

      if (category_name == CATEGORY_SHOES) {
        this.shoeSizeNames.push(bundle_name);
        this.shoesVendorIds.push(shop_id);
      }

      if (product_id && !this.productIdList.includes(product_id))
        this.productIdList.push(product_id);

      if (product_id && !(product_id in this.stockTypeMappingObject))
        this.stockTypeMappingObject[product_id] = is_preorder
          ? PRE_ORDER
          : IN_STOCK;
      if (
        product_id &&
        category_name &&
        !(product_id in this.categoryMappingObject)
      ) {
        this.categoryMappingObject[product_id] = category_name;
      }
      this.getColorName(variants[i]?.productVariant?.attributes, shop_id);
    }
  }

  async getLegacyColorMappingIDs(colorObject) {
    const URL = `${
      this.BASE_URL
    }/product/details?color-mapping=${JSON.stringify(colorObject)}`;
    const response = await axios.get(URL);
    const colorsData = response?.data?.data;
    this.colorsByShops = this.getColorsByShop(colorObject, colorsData);
    const data = hash(this.getColorsByShop(colorObject, colorsData), 'name');
    return data;
  }

  async getShoeSizeIDs(vendor_name_list, shoe_size_name_list) {
    const URL = `${
      this.BASE_URL
    }/product/shoe-sizes?vendor_name_list=${JSON.stringify(
      vendor_name_list,
    )}&shoe_size_name_list=${JSON.stringify(shoe_size_name_list)}`;
    const response = await http.get(URL);
    return response?.data;
  }

  async createOsShippingAddress(shipping_info) {
    return await addShippingAddressInfo(shipping_info);
  }

  getColorAttribute(attributes) {
    const result = attributes.filter(function (element) {
      if (element.attribute.name == 'Color') {
        return element;
      }
    });
    return result[0];
  }

  getColorName(elements, shop_id) {
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

  swapShopIdWithVendorId(color_objects, mapping_object) {
    const updated_mapping_object = {};

    for (const key in color_objects) {
      const mapping_key = mapping_object[key]['vendorId'];
      updated_mapping_object[mapping_key] = color_objects[key];
    }

    return updated_mapping_object;
  }

  replaceShopWithVendorId(shop_ids, mapping_object) {
    const vendorIds = shop_ids?.map(function (element) {
      return mapping_object[String(element)]['vendorId'];
    });

    return vendorIds;
  }

  getColorsByShop(shops, colorsData) {
    const colorsByShop = [];
    colorsData.map((color) => {
      const shopColorsList = shops[color.brand];
      if (shopColorsList.includes(color.name)) {
        colorsByShop.push(color);
      }
    });
    return colorsByShop;
  }

  getOsShopIdByShrShopId(shopMappingsList, shopId) {
    let sourceShopId: string;
    shopMappingsList.map((mapping) => {
      if (mapping.shopId == shopId) {
        sourceShopId = mapping.vendorId;
      }
    });
    return sourceShopId;
  }

  getColorIdFromColorsList(colorsByShop, color, shopId) {
    let colorId: string;
    colorsByShop.map((colorObject) => {
      if (colorObject.brand == shopId && colorObject.name == color) {
        colorId = colorObject.id;
      }
    });
    return colorId;
  }
}
