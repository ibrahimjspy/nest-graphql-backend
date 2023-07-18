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

export enum ProductOriginEnum {
  B2B = 'B2B',
  B2C = 'B2C',
}

export interface ElasticSearchProductsType {
  took: number;
  timed_out: boolean;
  _shards: {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
  };
  hits: {
    total: {
      value: number;
      relation: string;
    };
    max_score: number;
    hits: {
      _index: string;
      _id: string;
      _score: number;
      _ignored: string[];
      _source: {
        name: string;
        slug: string;
        description: string;
        rating: string;
        thumbnail: string;
        sku_list: string[];
        preorder: string;
        created_at: string;
        updated_at: string;
        product_type_id: string;
        product_type_name: string;
        category_ids: string[];
        category_names: string[];
        category_slugs: string[];
        default_variant_id: string;
        default_variant_image: null;
        default_variant_cost: string;
        channel_slugs: string[];
        channel_prices: string[];
        channel_publishings: string[];
        color_names: string[];
        color_slugs: string[];
        color_images: undefined[];
        id: string;
      };
    }[];
  };
}

export interface PopularItemsInterface {
  reportProductSales: {
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      endCursor: string;
      startCursor: string;
    };
    edges: {
      node: {
        product: {
          id: string;
        };
      };
    }[];
  };
}
