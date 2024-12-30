import { File } from "~domain/file";

export const isGreaterThan1MB = (file: File): boolean => {
  return file.size > 1000000;
};
