import { Metadata } from "../service";

/* This interface contains all channel with components to help to process business rules. 
 * In context of Database resource */
export default interface IDatabase {
  getMetadata(fileId: string): Promise<Metadata | null>;
  putMetadata(fileId: string, metadata: Metadata): Promise<void>;
}
