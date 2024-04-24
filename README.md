# MyBoothManager-Monorepo
## Set up environment
* Execute setup script on monorepo root,
   ```bash
   $ yarn pre
   ```
   This will install all dependencies and build the [common](packages/Common) and [common-ui](packages/CommonUI) packages.

* For running development server, on monorepo root,
   ```bash
   $ yarn dev
   ```
   This will start the development server for the [frontend admin](projects/Admin), [frontend public](projects/Public), and [backend](projects/Backend) concurrently.

* If the contents of common package is changed, you need to build it again. For that, on monorepo root,
   ```bash
   $ yarn common:build
   ```
   This will build the [common](packages/Common) and [common-ui](packages/CommonUI) packages and apply changes to projects.

## Development
### Versioning
* This project is *(trying to)* follow [Semantic Versioning](https://semver.org/).
* Also this project is using [`yarn version`](https://yarnpkg.com/cli/version) command to bump the version.
  There is a helper script defined in [root `package.json`](package.json), called `all:version`, which will bump the version of all packages and projects.
  ```bash
  $ yarn all:version minor  # or major, patch
  ```
