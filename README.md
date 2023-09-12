# MyBoothManager-Monorepo

## Set up environment
* Execute setup script on monorepo root,
   ```bash
   $ yarn pre
   ```
   This will install all dependencies and build the [common](packages/Common) package.

* For running development server, on monorepo root,
   ```bash
   $ yarn dev
   ```
   This will start the development server for the [frontend admin](projects/Admin) and [backend](projects/Backend) concurrently.

* If the contents of common package is changed, you need to build it again. For that, on monorepo root,
   ```bash
   $ yarn common:build
   ```
   This will build the [common](packages/Common) package and apply changes to projects.
