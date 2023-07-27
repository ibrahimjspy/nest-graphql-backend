import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { getAttributeQuery } from '../queries/attribute/attribute';
import { AttributeDetailType } from '../types/attribute';

export const getAttributeHandler = async (
  slug: string,
): Promise<AttributeDetailType> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(getAttributeQuery(slug)),
  );
  return response['attribute'];
};
