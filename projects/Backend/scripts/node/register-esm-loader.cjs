// This is needed to import ESM modules without the need to specify the file extension.
// Use as like this: `node --import register-esm-loader.cjs dist/src/main`

/* eslint-disable @typescript-eslint/no-var-requires */

const { register } = require("module");
const { pathToFileURL } = require("url");

register("@esbuild-kit/esm-loader", pathToFileURL("./"));
