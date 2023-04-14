import { GraphQLClient } from 'graphql-request';
import { graphqlEndpoint } from './graphqlEndpointToggle';
import { ResultErrorType } from 'src/graphql/exceptions/resultError.type';
import { HttpStatus, Logger } from '@nestjs/common';
import ResultError from 'src/graphql/exceptions/resultError';
import { prepareFailedResponse } from 'src/core/utils/response';
/**
 * This is top level function which handles graphql requests , exceptions and logic
 * @params Query ,  It must be in string format and no query based
 * logic should be transferred to graphqlHandler
 * @params isB2c , it is an optional parameter to allow specific functions to call b2c server while other
 * keep calling b2b services
 * @note This function determines its endpoint logic through another public method graphqlHandler() which
 * is based on env files content .
 * @returns an object with data or graphql error
 */

export const graphqlCall = async (
  Query: string,
  Token?: string,
  isB2c?: boolean,
): Promise<any> => {
  const startTime = new Date().getTime();
  const endpoint = graphqlEndpoint(isB2c ? isB2c : false);
  const logger = new Logger('Graphql client');
  const request = { endpoint: endpoint, queryName: Query.split('(')[0] };
  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `${Token}`,
    },
  });
  const response = await graphQLClient.request(Query);
  const endTime = new Date().getTime();
  logger.log('Request took ' + (endTime - startTime) + 'ms', { request });
  return response;
};

/**
 * It takes a GraphQL response object, checks if it contains an expected error,
 * and if it does, it throws a ResultError exception.
 * @param {object} response - object - the response object from the GraphQL query.
 * @param {boolean} [throwException=true] - boolean = true
 * @param {string} [message] - string = ''
 * @returns the response object.
 */
export const graphqlResultErrorHandler = async (
  response: object,
  throwException = true,
  message = '',
): Promise<any> => {
  const error: ResultErrorType = response[Object.keys(response)[0]] || {};

  if (error.__typename === 'ResultError' && throwException) {
    // to handle sharove-services expected errors.
    throw new ResultError(message ? message : error.message, error.errors);
  } else if (error.errors?.length > 0) {
    // to handle saleor-services expected errors.
    throw new ResultError(
      message ? message : error.errors[0]['message'],
      error.errors,
    );
  }

  return response;
};

/**
 * It takes an error object and returns a response object with the error message, error code, and
 * errors array
 * @param {Error | ResultError | any} error - Error | ResultError | any
 * @param {HttpStatus} [status] - The HTTP status code to return.
 * @returns A function that takes in an error and a status and returns an object with a message,
 * status, and errors.
 */
export const graphqlExceptionHandler = (
  error: Error | ResultError | any,
  status?: HttpStatus,
): any => {
  // Used to handle all the expected errors.
  if (error instanceof ResultError) {
    return prepareFailedResponse(error.message, status, error.errors);
  }

  // Used to handle all the unexpected errors.
  const response = error?.response;
  const errors = response?.errors || [];
  const errorMessage = (response?.errors?.length && response?.errors[0]?.message);
  let message = errorMessage || response?.data?.message || 'Something went wrong.';
  let error_code: number = error.type ? 500 : response?.status;
  if (status) {
    error_code = status;
  } else if (error_code === 200) {
    error_code = 400;
  }

  return prepareFailedResponse(message, error_code, errors);
};
