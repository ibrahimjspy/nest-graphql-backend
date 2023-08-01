import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';
import { checkoutPromoCodeAddMutation } from 'src/graphql/mutations/checkout/shipping/addShippingPromo';
import { checkoutPromoCodeRemoveMutation } from 'src/graphql/mutations/checkout/shipping/removeShippingPromo';
import { updateShippingMethodPriceMutation } from 'src/graphql/mutations/checkout/shipping/updateShippingMethodPrice';
import { getMarketplaceShippingMethodsQuery } from 'src/graphql/queries/checkout/shipping/getMarketplaceShippingMethods';
import { getCheckoutShippingAddressQuery } from 'src/graphql/queries/checkout/shipping/getShippingAddress';
import { getCheckoutShippingMethodsQuery } from 'src/graphql/queries/checkout/shipping/getShippingMethods';
import { getShippingZonesQuery } from 'src/graphql/queries/checkout/shipping/getShippingZones';
import { getShippingVouchersQuery } from 'src/graphql/queries/checkout/shipping/vouchers';
import { MarketplaceShippingMethodsType } from 'src/graphql/types/checkout.type';
import { UpdateShippingMethodPriceDto } from 'src/modules/checkout/shipping/dto/shippingMethods';

export const getCheckoutShippingMethodsHandler = async (
  checkoutId: string,
  token: string,
  isB2c = false,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      getCheckoutShippingMethodsQuery(checkoutId, isB2c),
      token,
      isB2c,
    ),
  );
  return response['checkout'];
};

export const getShippingVouchersHandler = async (token, isB2c = false) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(getShippingVouchersQuery(), token, isB2c),
  );
  return response['vouchers'];
};

export const addCheckoutPromoCodeHandler = async (
  checkoutId: string,
  promoCode: string,
  token,
  isB2c = false,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      checkoutPromoCodeAddMutation(checkoutId, promoCode),
      token,
      isB2c,
    ),
  );
  return response['checkoutAddPromoCode'];
};

export const removeCheckoutPromoCodeHandler = async (
  checkoutId: string,
  promoCode: string,
  token,
  isB2c = false,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      checkoutPromoCodeRemoveMutation(checkoutId, promoCode),
      token,
      isB2c,
    ),
  );
  return response['checkoutRemovePromoCode'];
};

export const getCheckoutShippingAddressHandler = async (
  checkoutId: string,
  token,
  isB2c = false,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      getCheckoutShippingAddressQuery(checkoutId),
      token,
      isB2c,
    ),
  );
  return response['checkout'];
};

export const getShippingZonesHandler = async (
  pagination: PaginationDto,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(getShippingZonesQuery(pagination), token),
  );
  return response['shippingZones'];
};

export const updateShippingMethodPriceHandler = async (
  updateShippingMethodPriceInput: UpdateShippingMethodPriceDto,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      updateShippingMethodPriceMutation(updateShippingMethodPriceInput),
      token,
    ),
  );
  return response['shippingMethodChannelListingUpdate'];
};

export const getMarketplaceShippingMethods = async (
  userEmail: string,
  token: string,
): Promise<MarketplaceShippingMethodsType> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(getMarketplaceShippingMethodsQuery(userEmail), token),
  );
  return response['checkoutBundles'];
};
