import { request } from 'graphql-request';
import { productCardsByListIdQuery } from 'src/graphql/queries/product/cardsByCategoryId';
import { graphqlEndpoint } from 'src/public/graphqlEndpointToggle';

export const productCardsByCategoriesHandler = async (id): Promise<object> => {
  let productCardsDataByCategories = {};
  await request(graphqlEndpoint(), productCardsByListIdQuery(id))
    .then((data) => {
      productCardsDataByCategories = data;
    })
    .catch(() => console.log('graphql error'));
  return productCardsDataByCategories;
};
