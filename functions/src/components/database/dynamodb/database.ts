import {
  DynamoDBClient,
  PutItemCommand,
  PutItemInput,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { Metadata } from "~domain/file";
import { IDatabase as IFileDatabase } from "~domain/file/components";

type DatabaseCredentials = {
  accessKeyId: string;
  secretAccessKey: string;
};

export default class Database implements IFileDatabase {
  private readonly client: DynamoDBClient;

  constructor(
    region: string,
    private readonly table: string,
    credentials: DatabaseCredentials,
  ) {
    this.client = new DynamoDBClient({
      region,
      credentials,
    });
  }

  async putMetadata(fileId: string, metadata: Metadata): Promise<void> {
    const params: PutItemInput = {
      TableName: this.table,
      Item: {
        ...marshall(metadata),
        id: {
          S: fileId,
        },
      },
    };
    const command = new PutItemCommand(params);
    await this.client.send(command);
  }
}
