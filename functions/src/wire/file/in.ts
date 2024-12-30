import { GetObjectCommandOutput } from "@aws-sdk/client-s3";

import { Data } from "~domain/file";

export const covertToData = async (out: GetObjectCommandOutput): Promise<Data> => {
  return {
    type: out.ContentType,
    length: out.ContentLength,
    body: await out.Body?.transformToByteArray(),
  };
};
