/** @type {import('ts-jest').JestConfigWithTsJest} **/
import {
  createDefaultPreset,
  type JestConfigWithTsJest,
} from "ts-jest";

const config: JestConfigWithTsJest = {
  ...createDefaultPreset({
    diagnostics: {
      pretty: true,
    },
  }),
  moduleNameMapper: {
    "^~(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
