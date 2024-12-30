import express, { Express, Router } from "express";
import morgan from "morgan";
import multer from "multer";
import http from "http";
import bodyParser from "body-parser";

import { IService as IFileService } from "~domain/file";
import * as file from "./file";

export type RESTHandlerServices = {
  file: IFileService;
};

export class RESTHandler {
  private readonly app: Express;

  constructor(private readonly services: RESTHandlerServices) {
    this.app = express();
  }

  private configure() {
    const v1 = Router();

    // Limit only file with size equals or less than 1MB
    const uploader = multer().single("file");

    v1.post("/upload", uploader, file.upload(this.services.file));
    v1.get("/metadata/:fileId", file.getMetadata(this.services.file));

    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(morgan("dev"));
    this.app.use(v1);
  }

  listen(port: number) {
    this.configure();

    const server = http.createServer(this.app);
    server.listen(port);
  }
}
