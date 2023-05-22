import { HttpStatus } from '@nestjs/common';
import { FailedResponseType, SuccessResponseType } from './response.type';
import { isObject } from './helpers';
import { GQL_EDGES } from 'src/constants';

/**
 * It returns a response object with a status code and a JSON object
 * @param {any} res - The response object
 * @param {any} data - The data that you want to send back to the client.
 * @returns A function that takes in a response and data and returns a response with the data and status code.
 */
export const makeResponse = async (res: any, data: any) => {
  // assign the data status to response object.
  const res_status = data?.status ? data.status : HttpStatus.OK;
  // remove status from the data object.
  delete data?.status;
  // assign response status to response object.
  return res.status(res_status).json(data);
};

/**
 * It takes in a data object, a message string, and a status code, and returns an object with the
 * status code, message, and data
 * @param {any} data - any - The data you want to send back to the client.
 * @param {string} [message=Success.] - The message to be returned in the response.
 * @param {HttpStatus} status - The HTTP status code.
 * @returns An object with the following properties:
 *   - status: The HTTP status code
 *   - message: A message to be displayed to the user
 *   - data: The data to be returned to the user
 * */
export const prepareSuccessResponse = async (
  data: any,
  message = '',
  status: HttpStatus = HttpStatus.OK,
): Promise<SuccessResponseType> => {
  const response: SuccessResponseType = {
    status: status ? status : HttpStatus.OK,
  };
  if (data) {
    response['data'] = data;
  }
  if (message) {
    response['message'] = message;
  }
  return response;
};

/**
 * It returns a failed response object
 * @param {string} [message=Failed.] - The message to be returned to the client.
 * @param {HttpStatus} status - The HTTP status code.
 * @param errors - Array<any> = []
 * @returns An object with a status, message, and errors.
 */
export const prepareFailedResponse = async (
  message = '',
  status: HttpStatus = HttpStatus.BAD_REQUEST,
  errors: Array<any> = [],
): Promise<FailedResponseType> => {
  const response: FailedResponseType = {
    status: status ? status : HttpStatus.BAD_REQUEST,
    message: message ? message : 'Failed.',
  };
  if (errors.length > 0) {
    response['errors'] = errors;
  }
  return response;
};

/**
 * Remove edges, node and __typename from graphql response
 * @param {Object} input - The graphql response
 * @returns {Object} Clean graphql response
 */
export const prepareGQLPaginatedResponse = async (input): Promise<any> => {
  if (!input) return null;
  const output = {};

  await Promise.all(
    Object.keys(input).map(async (key) => {
      if (input[key] && key === GQL_EDGES) {
        output['data'] = await Promise.all(
          input[key].map(
            async (edge) => await prepareGQLPaginatedResponse(edge.node),
          ),
        );
      } else if (isObject(input[key])) {
        output[key] = await prepareGQLPaginatedResponse(input[key]);
      } else if (key !== '__typename') {
        output[key] = input[key];
      }
    }),
  );

  return output;
};
