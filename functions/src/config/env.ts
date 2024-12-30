import { z } from "zod";
import "dotenv/config";

export const schema = z.object({
  AWS_BUCKET_NAME: z.string().min(1),
  AWS_TABLE_NAME: z.string().min(1),
  AWS_RUNNER_ACCESS_KEY_ID: z.string().min(1),
  AWS_RUNNER_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_RUNNER_REGION: z.string().min(1),
});

export default schema.parse(process.env);
