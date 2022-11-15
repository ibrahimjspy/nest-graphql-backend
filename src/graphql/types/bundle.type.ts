import { Scalars } from './scalars.type';
import { ShopType } from './shop.type';
import { ProductVariant } from './productVariant.type';

export interface BundleType {
  id: Scalars['String'];
  name: Scalars['String'];
  description: Scalars['String'];
  slug: Scalars['String'];
  shop: ShopType;
  variants?: BundleProductVariantType[];
}

export interface BundleProductVariantType {
  quantity: number;
  variant: ProductVariant;
}
