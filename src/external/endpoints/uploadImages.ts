import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const uploadImages = async (file: any, bucket: string) => {
  const params = {
    Bucket: bucket,
    Key: file.originalname,
    Body: file.buffer,
  };

  const uploadedImage = await s3.upload(params).promise();
  return uploadedImage?.Location;
};
