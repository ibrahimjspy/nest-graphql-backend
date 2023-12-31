export interface checkoutBundlesInterface {
  checkoutBundleId: string;
  isSelected: boolean;
  checkoutId: string;
  quantity: number;
  price: number;
  bundle: {
    id: string;
    isOpenBundle: boolean;
    name: string;
    description: string;
    slug: string;
    product: {
      name: string;
      id: string;
      thumbnail: {
        url: string;
      };
      media: {
        url: string;
      }[];
    };
    productVariants: {
      quantity: number;
      productVariant: {
        id: string;
        name: string;
        sku: string;
        attributes: {
          attribute: {
            name: string;
          };
          values: {
            name: string;
          }[];
        }[];
        product: {
          category: {
            ancestors: {
              edges: {
                node: {
                  id: string;
                  name: string;
                };
              }[];
            };
          };
        };
        pricing: {
          net: {
            amount: number;
            currency: string;
          };
        };
      };
    }[];
    shop: {
      id: string;
      name: string;
      madeIn: string;
      fields?: {
        name: string;
        values: string[];
      }[];
      shippingMethods: {
        id: string;
        shippingMethodId: string;
        shippingMethodTypeId: string;
      }[];
    };
  };
}
export interface shippingAddressType {
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2: string;
  phone: string;
  companyName: string;
  city: string;
  postalCode: string;
  countryArea: string;
  country: {
    code: string;
    country: string;
  };
}

export interface DeliveryMethodType {
  id: string;
  name: string;
}
