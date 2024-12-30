/** @type {import('ts-jest').JestConfigWithTsJest} **/
import { createDefaultPreset, type JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  ...createDefaultPreset({
    diagnostics: {
      pretty: true
    }
  }),
};

export default config;
