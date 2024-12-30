import { z } from "zod";
import "dotenv/config";

export const schema = z.object({
  AWS_REGION: z.string().min(1),
  AWS_BUCKET_NAME: z.string().min(1),
  AWS_TABLE_NAME: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  PORT: z.string().min(1)
});

export default schema.parse(process.env);
