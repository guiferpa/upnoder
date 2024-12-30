import { Metadata } from "../service";

export interface IDatabase {
  putMetadata(fileId: string, metadata: Metadata): Promise<void>;
}
