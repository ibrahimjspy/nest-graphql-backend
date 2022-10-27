import { Maybe, Scalars } from './scalars.type';
import {
  AttributeEntityTypeEnum,
  AttributeInputTypeEnum,
  AttributeTypeEnum,
  MeasurementUnitsEnum,
  ProductMediaType,
  ProductTypeKindEnum,
  ThumbnailFormatEnum,
  WeightUnitsEnum,
} from 'src/graphql/enums';

export type Weight = {
  unit: WeightUnitsEnum;
  value: Scalars['Float'];
};

export type Attribute = {
  id: Scalars['ID'];
  inputType?: Maybe<AttributeInputTypeEnum>;
  entityType?: Maybe<AttributeEntityTypeEnum>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  type?: Maybe<AttributeTypeEnum>;
  unit?: Maybe<MeasurementUnitsEnum>;
  valueRequired: Scalars['Boolean'];
  visibleInStorefront: Scalars['Boolean'];
  filterableInStorefront: Scalars['Boolean'];
  filterableInDashboard: Scalars['Boolean'];
  availableInGrid: Scalars['Boolean'];
  storefrontSearchPosition: Scalars['Int'];
  withChoices: Scalars['Boolean'];
};

export type File = {
  url: Scalars['String'];
  contentType?: Maybe<Scalars['String']>;
};

export type AttributeValue = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
  inputType?: Maybe<AttributeInputTypeEnum>;
  reference?: Maybe<Scalars['ID']>;
  file?: Maybe<File>;
  richText?: Maybe<Scalars['String']>;
  plainText?: Maybe<Scalars['String']>;
  boolean?: Maybe<Scalars['Boolean']>;
  date?: Maybe<Scalars['Date']>;
  dateTime?: Maybe<Scalars['DateTime']>;
};

export type SelectedAttribute = {
  attribute: Attribute;
  values: Array<AttributeValue>;
};

export type ProductType = {
  id: Scalars['ID'];
  name: Scalars['String'];
  slug: Scalars['String'];
  hasVariants: Scalars['Boolean'];
  isShippingRequired: Scalars['Boolean'];
  isDigital: Scalars['Boolean'];
  weight?: Maybe<Weight>;
  kind: ProductTypeKindEnum;
  productAttributes?: Maybe<Array<Attribute>>;
};

export type Image = {
  url: Scalars['String'];
  alt?: Maybe<Scalars['String']>;
};

export type Category = {
  id: Scalars['ID'];
  seoTitle?: Maybe<Scalars['String']>;
  seoDescription?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  slug: Scalars['String'];
  parent?: Maybe<Category>;
  level: Scalars['Int'];
};

export type ProductVariant = {
  id: Scalars['ID'];
  channel?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  sku?: Maybe<Scalars['String']>;
  product: Product;
  margin?: Maybe<Scalars['Int']>;
  quantityOrdered?: Maybe<Scalars['Int']>;
  created: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type ProductMedia = {
  id: Scalars['ID'];
  sortOrder?: Maybe<Scalars['Int']>;
  alt: Scalars['String'];
  type: ProductMediaType;
  oembedData: Scalars['String'];
};

export type Product = {
  id: Scalars['ID'];
  seoTitle?: Maybe<Scalars['String']>;
  seoDescription?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  productType: ProductType;
  slug: Scalars['String'];
  category?: Maybe<Category>;
  created: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  chargeTaxes: Scalars['Boolean'];
  weight?: Maybe<Weight>;
  defaultVariant?: Maybe<ProductVariant>;
  rating?: Maybe<Scalars['Float']>;
  channel?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Image>;
  attributes: Array<SelectedAttribute>;
  variants?: Maybe<Array<ProductVariant>>;
  media?: Maybe<Array<ProductMedia>>;
  availableForPurchaseAt?: Maybe<Scalars['DateTime']>;
  isAvailableForPurchase?: Maybe<Scalars['Boolean']>;
};

export type ProductThumbnailArgs = {
  size?: Maybe<Scalars['Int']>;
  format?: Maybe<ThumbnailFormatEnum>;
};
