import { productCardsDefaultQuery } from 'src/graphql/queries/product/cards';
import { graphqlCall } from 'src/public/graphqlHandler';

export const productCardHandler = async (): Promise<object> => {
  return graphqlCall(productCardsDefaultQuery());
};
