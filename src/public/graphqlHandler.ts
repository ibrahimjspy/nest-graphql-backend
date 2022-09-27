import { request } from 'graphql-request';
import { graphqlEndpoint } from './graphqlEndpointToggle';
import { ResultErrorType } from '../types/graphql/exceptions/resultError';
import { HttpStatus } from '@nestjs/common';
import ResultError from '../graphql/exceptions/resultError';
import { prepareFailedResponse } from 'src/utils/response';

/**
 * This is top level function which handles graphql requests , exceptions and logic
 * @params Query ,  It must be in string format and no query based
 * logic should be transferred to graphqlHandler
 * @params Mock , it is an optional parameter to allow specific functions to call mock server while other
 * keep calling federation services
 * @note This function determines its endpoint logic through another public method graphqlHandler() which
 * is based on env files content .
 * @returns an object with data or graphql error
 */
export const graphqlCall = async (
  Query: string,
  Mock?: string,
): Promise<object> => {
  return await request(graphqlEndpoint(Mock ? Mock : ''), Query);
};

export const graphqlResultErrorHandler = async (
  response: object,
  throwException: boolean = true,
  message: string = '',
): Promise<object> => {
  const error: ResultErrorType = response[Object.keys(response)[0]];

  if (error.__typename === 'ResultError' && throwException) {
    throw new ResultError(message ? message : error.message, error.errors);
  }

  return response;
};

export const graphqlExceptionHandler = (
  error: Error | ResultError | any,
  status?: HttpStatus,
): object | any => {
  if (error instanceof ResultError) {
    return prepareFailedResponse(error.message, status, error.errors);
  }

  const message = 'Something went wrong.';
  const federation_response = error?.response?.error
    ? message
    : error?.response?.errors[0]?.message;
  const error_response = {
    message: error.type ? message : federation_response,
  };
  const error_message = error_response ? error_response : 'server side';
  const error_code: number = error.type ? 500 : error?.response?.status;
  console.log('graphql error', error_message);
  return {
    status: error_code == 200 ? 405 : error_code,
    message: error_message,
  };
};
