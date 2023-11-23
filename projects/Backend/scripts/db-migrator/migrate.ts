// Umzug migrator script hardly referenced from https://github.com/sequelize/umzug/tree/main/examples/1-sequelize-typescript
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

(import("./umzug")).then((umzug) => umzug.migrator.runAsCLI());
