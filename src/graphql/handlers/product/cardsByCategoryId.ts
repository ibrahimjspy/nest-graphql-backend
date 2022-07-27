import { request } from 'graphql-request';
import { productCardsByCategoryIdQuery } from 'src/graphql/queries/product/cardsByListId';
import { graphqlEndpoint } from 'src/public/graphqlEndpointToggle';

export const productCardsByCategoriesHandler = async (id): Promise<object> => {
  let productCardsDataByCategories = {};
  await request(graphqlEndpoint(), productCardsByCategoryIdQuery(id))
    .then((data) => {
      productCardsDataByCategories = data;
    })
    .catch(() => console.log('graphql error'));
  return productCardsDataByCategories;
};
