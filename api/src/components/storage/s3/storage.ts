import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { IStorage as IFileStorage } from "~domain/file/components";
import { File, Metadata } from "~domain/file";

type StorageCredentials = {
  accessKeyId: string;
  secretAccessKey: string;
};

/* It's a class that implements all interfaces in Storage context given any domain, in this case
 * the doamin is only file but it could have others */
export default class Storage implements IFileStorage {
  private readonly client: S3Client;

  constructor(
    region: string,
    private readonly bucket: string,
    credentials: StorageCredentials,
  ) {
    this.client = new S3Client({
      region,
      credentials,
    });
  }

  async upload(file: File, metadata: Metadata, fileId: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileId,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentLength: file.size,
      Metadata: metadata,
    });
    await this.client.send(command);
  }
}
