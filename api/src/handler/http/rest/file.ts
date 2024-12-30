import { Request, Response } from "express";
import HTTPStatusCodes from "http-status-codes";
import { z } from "zod";

import { IService } from "~domain/file";
import { BadRequestError } from "~domain/file/errors";

const UploadSchema = z.object({
  author: z.string().min(3),
});

type UploadParsedBody = z.infer<typeof UploadSchema>;

export function upload(service: IService) {
  return async (req: Request, res: Response) => {
    if (req.file) {
      try {
        const body: UploadParsedBody = UploadSchema.parse(req.body);
        const id = await service.upload(req.file, body);
        res.status(HTTPStatusCodes.CREATED).json({ id });
      } catch (err) {
        if (err instanceof z.ZodError) {
          res.status(HTTPStatusCodes.BAD_REQUEST).json(err);
        } else {
          res.status(HTTPStatusCodes.INTERNAL_SERVER_ERROR).json({
            message: (err as Error).message,
          });
        }
      }
    } else {
      res.status(HTTPStatusCodes.BAD_REQUEST).json({
        message: "missing file",
      });
    }
  };
}

export function getMetadata(service: IService) {
  return async (req: Request, res: Response) => {
    try {
      const metadata = await service.getMetadata(req.params.fileId);
      if (metadata) {
        res.status(HTTPStatusCodes.OK).json({ metadata });
      } else {
        res.status(HTTPStatusCodes.NOT_FOUND).json({
          message: `metadata with key equals '${req.params.fileId}' not found`,
        });
      }
    } catch (err) {
      if (err instanceof BadRequestError) {
        res.status(HTTPStatusCodes.BAD_REQUEST).json({
          message: err.message,
        });
        return;
      }
      res.status(HTTPStatusCodes.INTERNAL_SERVER_ERROR).json({
        message: (err as Error).message,
      });
    }
  };
}
