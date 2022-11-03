class MediaDto {
  url: string;
}

class ProductDto {
  name: string;
  media: MediaDto[];
}

class AttributeValueDto {
  name: string;
}

class AttributeDto {
  attribute: {
    name: string;
  };
  values: AttributeValueDto[];
}

class VariantDto {
  variant: {
    id: string;
    product: ProductDto;
    attributes: AttributeDto[];
    pricing: {
      price: {
        gross: {
          currency: string;
          amount: number;
        };
      };
    };
    media: MediaDto[];
  };
  quantity: number;
}

class BundleDto {
  id: string;
  variants: VariantDto[];
}

class OrderBundleDto {
  bundle: BundleDto;
  quantity: number;
  totalAmount: number;
  fulfillmentStatus: string;
}

class FulfillmentsDto {
  id: string;
  fulfillmentId: string;
  fulfillmentBundles: BundleDto[];
}

class AddressDto {
  streetAddress1: string;
  streetAddress2: string;
}

export class ShopOrdersFulfillmentsDto {
  number?: string;
  userEmail?: string;
  shippingAddress?: AddressDto;
  billingAddress?: AddressDto;
  customerNote?: string;
  totalAmount: number;
  orderBundles: OrderBundleDto[];
  fulfillments: FulfillmentsDto[];
}
