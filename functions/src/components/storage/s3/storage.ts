import {
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Data } from "~domain/file";

import { IStorage as IFileStorage } from "~domain/file/components";
import * as FileWireIn from "~wire/file/in";

type StorageCredentials = {
  accessKeyId: string;
  secretAccessKey: string;
};

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

  async getData(fileId: string): Promise<Data> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: fileId,
    });
    const result = await this.client.send(command);
    return FileWireIn.covertToData(result);
  }
}
