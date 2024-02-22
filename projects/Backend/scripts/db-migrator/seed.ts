// Umzug seeder script hardly referenced from https://github.com/sequelize/umzug/tree/master/examples/4.sequelize-seeders
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

(import("./umzug")).then((umzug) => umzug.seeder.runAsCLI());
