import { Handler, S3Event } from "aws-lambda";
import { IService as IFileService } from "~domain/file";

type S3HandlerServices = {
  file: IFileService;
};

export default class S3Handler {
  static summon(services: S3HandlerServices): Handler {
    return async (event: S3Event) => {
      const [record] = event.Records;
      if (!record) return;

      // Calling business rule for process metadata given uploaded file id
      await services.file.processExtraMetadata(record.s3.object.key);
    };
  }
}
