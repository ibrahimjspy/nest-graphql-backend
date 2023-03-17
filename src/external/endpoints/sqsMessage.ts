import * as AWS from 'aws-sdk';
import { Logger } from '@nestjs/common';
import { QUEUE_URL, SQS_ACCESSID, SQS_SECRET_ACCESS_KEY } from 'src/constants';

export const sqsService = new AWS.SQS({
  apiVersion: '2012-11-05',
  accessKeyId: SQS_ACCESSID,
  secretAccessKey: SQS_SECRET_ACCESS_KEY,
  region: 'us-east-2',
});

export default class SqsService {
  private readonly logger = new Logger(SqsService.name);

  constructor() {
    return;
  }

  public async send(params: any) {
    /* The below code is sending a message to the SQS queue. */
    const sqsObject = {
      MessageBody: JSON.stringify(params),
      // MessageDeduplicationId: "TheWhistler",
      QueueUrl: QUEUE_URL,
    };
    return new Promise((resolve, reject) => {
      return sqsService.sendMessage(sqsObject, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: data.MessageId });
        }
      });
    });
  }
}
