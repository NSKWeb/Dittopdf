import AWS from "aws-sdk";

const bucket = process.env.AWS_S3_BUCKET ?? "";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

export async function uploadFile({
  key,
  body,
  contentType
}: {
  key: string;
  body: Buffer;
  contentType: string;
}) {
  if (!bucket) {
    return { url: `/downloads/${key}` };
  }

  await s3
    .putObject({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType
    })
    .promise();

  return { url: `https://${bucket}.s3.amazonaws.com/${key}` };
}
