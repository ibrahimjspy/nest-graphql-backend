import {
  graphqlCall,
  graphqlExceptionHandler,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { PushToStoreDto } from 'src/modules/productStore/dto/products';
import { pushToStoreMutation } from '../mutations/productStore/pushtToStore';

export const pushToStoreHandler = async (
  pushToStoreInput: PushToStoreDto,
  token: string,
): Promise<object> => {
  try {
    const response = await graphqlResultErrorHandler(
      await graphqlCall(pushToStoreMutation(pushToStoreInput), token),
    );
    return response['createProducts'];
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};
