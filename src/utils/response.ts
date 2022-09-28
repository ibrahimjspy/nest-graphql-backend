import { HttpStatus } from '@nestjs/common';

/**
 * It returns a response object with a status code and a JSON object
 * @param {any} res - The response object
 * @param {any} data - The data that you want to send back to the client.
 * @returns A function that takes in a response and data and returns a response with the data and status code.
 */
export const makeResponse = async (res: any, data: any) => {
  const res_status = data?.status ? data.status : HttpStatus.OK;
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
  message: string = 'Success.',
  status: HttpStatus = HttpStatus.OK,
) => {
  return {
    status: status ? status : HttpStatus.OK,
    message: message ? message : 'Success.',
    data,
  };
};

/**
 * It returns a failed response object
 * @param {string} [message=Failed.] - The message to be returned to the client.
 * @param {HttpStatus} status - The HTTP status code.
 * @param errors - Array<any> = []
 * @returns An object with a status, message, and errors.
 */
export const prepareFailedResponse = async (
  message: string = 'Failed.',
  status: HttpStatus = HttpStatus.BAD_REQUEST,
  errors: Array<any> = [],
) => {
  return {
    status: status ? status : HttpStatus.BAD_REQUEST,
    message: message ? message : 'Failed.',
    errors,
  };
};
