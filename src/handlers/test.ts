import { request } from 'graphql-request';
import { aniQuery, paramQuery } from 'src/queries/mock';

// Mock graphQl request functions
export const fetchMock = async () => {
  let Data = {};
  await request('https://graphql.anilist.co', aniQuery()).then(
    (data) => (Data = data),
  );
  return Data;
};
export const fetchParamMock = async (id: number) => {
  let Data = {};
  await request('https://rickandmortyapi.com/graphql', paramQuery(id)).then(
    (data) => (Data = data),
  );
  return Data;
};
