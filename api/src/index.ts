import { Database } from "~components/database/dynamodb";
import { Storage } from "~components/storage/s3";
import { Service as FileService } from "~domain/file";
import RESTHandler from "~handler/http/rest";
import env from "~config/env";

const components = {
  database: new Database(env.AWS_REGION, env.AWS_TABLE_NAME, {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  }),
  storage: new Storage(env.AWS_REGION, env.AWS_BUCKET_NAME, {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  }),
};

const handler = new RESTHandler({
  file: new FileService(components),
});

const port: number = Number.parseInt(env.PORT) || 3000;
handler.listen(port);
