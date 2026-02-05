import AWS from "aws-sdk";
import { promises as fs } from "fs";
import path from "path";

const bucket = process.env.AWS_S3_BUCKET ?? "";
const localDir = path.join(process.cwd(), ".uploads");
const localFiles = new Map<string, { path: string; contentType: string; expiresAt: number }>();
const cleanupWindowMs = 60 * 60 * 1000;

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

export function isLocalStorageEnabled() {
  return !bucket;
}

export function getLocalFileEntry(key: string) {
  return localFiles.get(normalizeKey(key));
}

export function getLocalFilePath(key: string) {
  return path.join(localDir, normalizeKey(key));
}

export async function uploadFile({
  key,
  body,
  contentType
}: {
  key: string;
  body: Buffer;
  contentType: string;
}) {
  const safeKey = normalizeKey(key);
  if (!bucket) {
    await fs.mkdir(localDir, { recursive: true });
    const filePath = path.join(localDir, safeKey);
    await fs.writeFile(filePath, body);
    localFiles.set(safeKey, {
      path: filePath,
      contentType,
      expiresAt: Date.now() + cleanupWindowMs
    });
    scheduleCleanup(safeKey);
    return { url: `/downloads/${safeKey}` };
  }

  await s3
    .putObject({
      Bucket: bucket,
      Key: safeKey,
      Body: body,
      ContentType: contentType
    })
    .promise();

  return { url: `https://${bucket}.s3.amazonaws.com/${safeKey}` };
}

function normalizeKey(key: string) {
  return key.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function scheduleCleanup(key: string) {
  const entry = localFiles.get(key);
  if (!entry) {
    return;
  }
  const delay = Math.max(entry.expiresAt - Date.now(), 0);
  setTimeout(async () => {
    try {
      await fs.unlink(entry.path);
    } catch (error) {
      return;
    }
    localFiles.delete(key);
  }, delay);
}
