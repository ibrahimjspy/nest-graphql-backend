import { Scalars } from './scalars.type';
import { ShopType } from './shop.type';

export interface BundleType {
  id: Scalars['String'];
  name: Scalars['String'];
  description: Scalars['String'];
  slug: Scalars['String'];
  shop: ShopType;
}
