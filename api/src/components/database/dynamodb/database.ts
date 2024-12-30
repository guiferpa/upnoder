import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
  PutItemCommand,
  PutItemInput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Metadata } from "~domain/file";
import { IDatabase as IFileDatabase } from "~domain/file/components";

type DatabaseCredentials = {
  accessKeyId: string;
  secretAccessKey: string;
};

/* It's a class that implements all interfaces in Database context given any domain, in this case
 * the doamin is only file but it could have others */
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

  async getMetadata(fileId: string): Promise<Metadata | null> {
    const params: GetItemCommandInput = {
      TableName: this.table,
      Key: {
        id: {
          S: fileId,
        },
      },
    };
    const command = new GetItemCommand(params);
    const response = await this.client.send(command);
    return response.Item ? unmarshall(response.Item) : null;
  }
}
