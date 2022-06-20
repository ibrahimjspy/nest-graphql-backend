import { request } from 'graphql-request';
import { rickQuery } from 'src/queries/mock';

export const fetchMock = async () => {
  let Data = {};
  await request('https://rickandmortyapi.com/graphql', rickQuery(3)).then(
    (data) => (Data = data),
  );
  return Data;
};
