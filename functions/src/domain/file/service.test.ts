import fs from "fs";
import path from "path";
import { promisify } from "util";

import { FileTypes, Service } from "./service";

describe("File service", () => {
  const services = {
    storage: {
      getData: jest.fn(),
    },
    database: {
      putMetadata: jest.fn(),
    },
  };

  test("Should extract PDF extra datas", async () => {
    const filename = "../../../assets/application-pdf.pdf";
    const buffer = await promisify(fs.readFile)(path.join(__dirname, filename));
    const service = new Service(services);
    const got = service.processFileData({
      type: FileTypes.PDF,
      body: Uint8Array.from(buffer),
    });
    await expect(got).resolves.toBeTruthy();
  });

  test("Should extract PNG image extra datas", async () => {
    const filename = "../../../assets/image-png.png";
    const buffer = await promisify(fs.readFile)(path.join(__dirname, filename));
    const service = new Service(services);
    const got = service.processFileData({
      type: FileTypes.PNG,
      body: Uint8Array.from(buffer),
    });
    await expect(got).resolves.toBeTruthy();
  });

  test("Should extract JPEG image extra datas", async () => {
    const filename = "../../../assets/image-jpeg.jpeg";
    const buffer = await promisify(fs.readFile)(path.join(__dirname, filename));
    const service = new Service(services);
    const got = service.processFileData({
      type: FileTypes.JPEG,
      body: Uint8Array.from(buffer),
    });
    await expect(got).resolves.toBeTruthy();
  });

  test("Should extract JPG image extra datas", async () => {
    const filename = "../../../assets/image-jpg.jpg";
    const buffer = await promisify(fs.readFile)(path.join(__dirname, filename));
    const service = new Service(services);
    const got = service.processFileData({
      type: FileTypes.JPG,
      body: Uint8Array.from(buffer),
    });
    await expect(got).resolves.toBeTruthy();
  });

  test("Should extract TXT extra datas", async () => {
    const filename = "../../../assets/text-plain.txt";
    const buffer = await promisify(fs.readFile)(path.join(__dirname, filename));
    const service = new Service(services);
    const got = service.processFileData({
      type: "text/plain",
      body: Uint8Array.from(buffer),
    });
    await expect(got).resolves.toBeFalsy();
  });
});
