import pdf from "pdf-parse";
import sharp from "sharp";

import { normalizeMetadataKeys } from "~logic/file";
import { IDatabase, IStorage } from "./components";

export enum FileTypes {
  PDF = "application/pdf",
  PNG = "image/png",
  JPEG = "image/jpeg",
  JPG = "image/jpg",
}

export type Data = {
  type?: string;
  length?: number;
  body?: Uint8Array;
};

// eslint-disable-next-line
export type Metadata = Record<string, any>;

export interface IService {
  processExtraMetadata(fileId: string): Promise<void>;
}

type ServiceComponents = {
  storage: IStorage;
  database: IDatabase;
};

/* This struct implements all interface that handler will use to call app's business rules.
 * These business rules are defined in interface named IService look at line 23 */
export class Service implements IService {
  constructor(private readonly components: ServiceComponents) { }

  private async processPDFExtraMetadata(
    data: Data,
  ): Promise<Metadata | undefined> {
    if (data.body) {
      const buffer = Buffer.from(data.body);
      return await pdf(buffer);
    }
  }

  private async processImageExtraMetadata(
    data: Data,
  ): Promise<Metadata | undefined> {
    if (data.body) {
      const buffer = Buffer.from(data.body);
      return await sharp(buffer).metadata();
    }
  }

  public async processFileData(data: Data): Promise<Metadata | undefined> {
    if (data?.type === FileTypes.PDF) {
      return this.processPDFExtraMetadata(data);
    }
    if (
      [FileTypes.JPG, FileTypes.JPEG, FileTypes.PNG].includes(
        data.type as FileTypes,
      )
    ) {
      return this.processImageExtraMetadata(data);
    }
  }

  async processExtraMetadata(fileId: string): Promise<void> {
    // Calling Storage component for help to get data from S3
    const data = await this.components.storage.getData(fileId);

    // Split business rule in different handles
    const extra = await this.processFileData(data);
    const metadata = {
      status: "processed",
      type: "type" in data && data.type,
      length: "length" in data && data.length,
    };
    if (extra) Object.assign(metadata, { ...normalizeMetadataKeys(extra) });

    /* Calling Database component for help to persist data in Dynamo table.
     * In this case the app's updating the table item given all data already extracted from file */
    await this.components.database.putMetadata(fileId, metadata);
  }
}
