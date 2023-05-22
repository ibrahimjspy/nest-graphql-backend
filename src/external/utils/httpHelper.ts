/**
 * If there's an error, log the error's response data, status, and headers, or the error's request, or
 * the error's message
 * @param error - The error object that was thrown
 */
export function getHttpErrorMessage(error) {
  if (error?.response) {
    /*
     * The request was made and the server responded with a
     * status code that falls out of the range of 2xx
     */
    return { message: error.response, status: error.response.status };
  } else if (error?.request) {
    /*
     * The request was made but no response was received, `error.request`
     * is an instance of XMLHttpRequest in the browser and an instance
     * of http.ClientRequest in Node.js
     */
    return { message: error.request.data, status: 500 };
  } else {
    // Something happened in setting up the request and triggered an Error
    return { message: 'Something went wrong', status: 500 };
  }
}
