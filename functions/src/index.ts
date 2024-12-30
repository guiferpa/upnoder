import { Storage } from "~components/storage/s3";
import { Database } from "~components/database/dynamodb";
import { Service as FileService } from "~domain/file";
import S3Handler from "~handler/trigger/s3";
import env from "~config/env";

// Struct used as parameter with all components instantiated
const components = {
  storage: new Storage(env.AWS_RUNNER_REGION, env.AWS_BUCKET_NAME, {
    accessKeyId: env.AWS_RUNNER_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_RUNNER_SECRET_ACCESS_KEY,
  }),
  database: new Database(env.AWS_RUNNER_REGION, env.AWS_TABLE_NAME, {
    accessKeyId: env.AWS_RUNNER_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_RUNNER_SECRET_ACCESS_KEY,
  }),
};

// Struct used as parameter with all services instantiated
const services = {
  file: new FileService(components),
};

// Summoning S3 handler given this function it'll be called given a S3 event happened
export const handler = S3Handler.summon(services);
