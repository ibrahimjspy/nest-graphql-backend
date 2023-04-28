import { gql } from 'graphql-request';
import { graphqlObjectTransform } from 'src/core/utils/helpers';
import { shippingMethodFragment } from 'src/graphql/fragments/checkout/shipping/shippingMethod';
import { UpdateShippingMethodPriceDto } from 'src/modules/checkout/shipping/dto/shippingMethods';

export const updateShippingMethodPriceMutation = (
  updateShippingMethodPriceInput: UpdateShippingMethodPriceDto,
) => {
  const { shippingMethodId, channelListingUpdate } =
    updateShippingMethodPriceInput;
  const stringifyChannelListing = graphqlObjectTransform(channelListingUpdate);
  return gql`
    mutation {
      shippingMethodChannelListingUpdate(
        id: "${shippingMethodId}"
        input: { addChannels: ${stringifyChannelListing} }
      ) {
        shippingMethod {
          ... ShippingMethod
        }
      }
    }
    ${shippingMethodFragment}
  `;
};
