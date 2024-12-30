import { Readable } from "stream";
import { v4 as uuid } from "uuid";

import { isGreaterThan1MB } from "~logic/file";
import { IDatabase, IStorage } from "./components";
import { BadRequestError } from "./errors";

export type Metadata = Record<string, string>;

export interface File {
  fieldname: string;
  originalname: string;
  mimetype: string;
  size: number;
  stream: Readable;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

export interface IService {
  upload(file: File, metadata: Metadata): Promise<string>;
  getMetadata(fileId: string): Promise<Metadata | null>;
}

type ServiceComponents = {
  database: IDatabase;
  storage: IStorage;
};

export class Service implements IService {
  constructor(private readonly components: ServiceComponents) {}

  async upload(file: File, metadata: Metadata): Promise<string> {
    if (isGreaterThan1MB(file))
      throw new BadRequestError("the file cannot be greater than 1MB");

    const fileId = uuid();
    await this.components.storage.upload(file, metadata, fileId);
    await this.components.database.putMetadata(fileId, {
      ...metadata,
      status: "processing",
    });
    return fileId;
  }

  async getMetadata(fileId: string): Promise<Metadata | null> {
    return await this.components.database.getMetadata(fileId);
  }
}
