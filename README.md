# MyBoothManager-Monorepo
## Development
### Set up environment
* Initialize the project:
   ```bash
   $ yarn install && yarn common:build
   ```
   This will install all dependencies and build the [common](packages/Common) and [common-ui](packages/CommonUI) packages.

* Run the development server of all projects:
   ```bash
   $ yarn dev
   ```
   This will start the development server for the [frontend admin](projects/Admin), [frontend public](projects/Public), and [backend](projects/Backend) concurrently.

* Apply changes of common packages:
   ```bash
   $ yarn common:build
   ```
   This will build the [common](packages/Common) and [common-ui](packages/CommonUI) packages and apply changes to projects.

### Default local development server settings
> To make CORS headers and HTTP cookie work on local environment too, don't navigate to localhost IP address directly.
* **Backend**: [api.sora.localhost:20000](http://api.sora.localhost:20000)
* **Frontend Admin**: [admin.sora.localhost:20001](http://admin.sora.localhost:20001)
* **Frontend Public**: [public.sora.localhost:20002](http://public.sora.localhost:20002)

### Versioning
* This project is *(trying to)* follow [Semantic Versioning](https://semver.org/).
* Also this project is using [`yarn version`](https://yarnpkg.com/cli/version) command to bump the version.
  There is a helper script defined in [root `package.json`](package.json), called `all:version`, which will bump the version of all packages and projects.
  ```bash
  $ yarn all:version minor  # or major, patch
  ```
