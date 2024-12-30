// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

const recommended = tseslint.config(
  {
    ignores: ["dist"],
    ...eslint.configs.recommended,
  },
  tseslint.configs.recommended,
);

const custom = [{
  ignores: ["dist"]
}];

export default [...recommended, ...custom];
