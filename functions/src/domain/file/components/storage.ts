import { Data } from "../service";

export interface IStorage {
  getData(fileId: string): Promise<Data>;
}
