import { File, Metadata } from "../service";

/* This interface contains all channel with components to help to process business rules. 
 * In context of Storage resource */
export default interface IStorage {
  upload(file: File, metadata: Metadata, fileId: string): Promise<void>;
}
