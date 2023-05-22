export interface MarketplaceBundlesType {
  checkoutId: string;
  validations: string;
  userEmail: string;
  totalPrice: {
    tax: {
      amount: number;
    };
    currency: string;
    gross: {
      amount: number;
    };
    net: {
      amount: number;
    };
  };
  shops: {
    id: string;
    name: string;
    validations: string;
    lines: {
      isSelected: boolean;
      checkoutBundleId: string;
      bundle: {
        id: string;
        name: string;
        productVariants: {
          quantity: number;
          productVariant: {
            quantity: number;
            productVariant: {
              id: string;
              product: {
                id: string;
                slug: string;
                name: string;
                media: {
                  url: string;
                }[];
              };
              attributes: {
                attribute: {
                  name: string;
                };
                values: {
                  name: string;
                }[];
              }[];
              pricing: {
                price: {
                  net: {
                    amount: number;
                    currency: string;
                  };
                  gross: {
                    currency: string;
                    amount: number;
                  };
                };
                onSale: boolean;
              };
              media: {
                url: string;
              }[];
            };
          }[];
        }[];
      };
    }[];
  }[];
}
