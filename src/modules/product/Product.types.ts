export interface MarketplaceProductsResponseType {
  totalCount: number;
  edges: Array<{
    node: {
      productId: string;
    };
  }>;
}
export interface BundleCreateResponseType {
  status: number;
  data: {
    id: string;
    name: string;
    description: string;
    slug: string;
  };
}

export interface GetBundleResponseType {
  status: number;
  data: {
    id: string;
    productVariants: {
      productVariant: {
        id: string;
      };
      quantity: number;
    }[];
  };
}

export interface ProductDetailType {
  data: {
    product: {
      id: string;
      description: string;
      name: string;
      slug: string;
      metadata: {
        key: string;
        value: string;
      }[];
      category: {
        id: string;
        name: string;
      };
      attributes: {
        attribute: {
          name: string;
        };
        values: {
          name: string;
        }[];
      }[];
      thumbnail: {
        url: string;
      };
      media: {
        url: string;
      }[];
      defaultVariant: {
        id: string;
        sku: string;
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
            gross: {
              currency: string;
              amount: number;
            };
            net: {
              currency: string;
              amount: number;
            };
          };
        };
      };
      variants: {
        id: string;
        sku: string;
        media: {
          url: string;
        }[];
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
            gross: {
              currency: string;
              amount: number;
            };
            net: {
              currency: string;
              amount: number;
            };
          };
        };
      }[];
    };
  };
}

export interface BundlesType {
  data: {
    edges: {
      node: {
        id: string;
        name: string;
        isOpenBundle: boolean;
        description: string;
        slug: string;
        shop: {
          id: string;
          name: string;
          email: string;
          url: string;
          madeIn: string;
          minOrder: number;
          description: string;
          about: string;
          returnPolicy: string;
          storePolicy: string;
          fields: {
            name: string;
            values: string[];
          }[];
        };
        productVariants: {
          quantity: number;
          productVariant: {
            id: string;
          };
        }[];
      };
    }[];
  };
}
export interface BundlesResponseType {
  data: {
    edges: {
      node: {
        id: string;
        name: string;
        isOpenBundle: boolean;
        description: string;
        slug: string;
        product: {
          id: string;
          description: string;
          name: string;
          slug: string;
          metadata: {
            key: string;
            value: string;
          }[];
          attributes: {
            attribute: {
              name: string;
            };
            values: {
              name: string;
            }[];
          }[];
          thumbnail: {
            url: string;
          };
          media: {
            url: string;
          }[];
        };
        shop: {
          id: string;
          name: string;
          email: string;
          url: string;
          madeIn: string;
          minOrder: number;
          description: string;
          about: string;
          returnPolicy: string;
          storePolicy: string;
          fields: {
            name: string;
            values: string[];
          }[];
        };
        productVariants: {
          quantity: number;
          productVariant: {
            id: string;
            sku: string;
            attributes: {
              attribute: {
                name: string;
              };
              values: {
                name: string;
              }[];
            }[];
            media: {
              url: string;
            }[];
            pricing: {
              price: {
                gross: {
                  currency: string;
                  amount: number;
                };
                net: {
                  currency: string;
                  amount: number;
                };
              };
            };
          };
        }[];
      };
    }[];
  };
}
