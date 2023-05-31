import axios from 'axios';
import https from 'https';
import { WORKFLOW_URL } from 'src/constants';

/**
 * Handles the retrieval of a workflow by its name.
 * @param  workflowName - The name of the workflow.
 * @returns The workflow data.
 */
export const workflowHandler = async (workflowName) => {
  /**
   * The URL to retrieve the workflow.
   */
  const URL = `${WORKFLOW_URL}/${workflowName}`;

  /**
   * The response object from the HTTP request.
   */
  const response = await axios.get(URL, {
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  });

  /**
   * Update the workflow status to match the status property.
   */
  response.data.workflowStatus = response.data.status;

  /**
   * Set the status code to 200 (OK).
   */
  response.data.status = 200;

  /**
   * Return the workflow data.
   */
  return response.data;
};
