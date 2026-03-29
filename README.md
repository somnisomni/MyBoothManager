## 개발 종료
MyBoothManager는 개발이 종료된 프로젝트입니다. 더 이상 새로운 기능이 추가되거나 버그가 수정되지 않습니다.

이 프로젝트는 서브컬처 동인 행사에서 부스 운영을 직간접적으로 체험해보며 느낀 불편함과 아이디어를 바탕으로, 동인 행사에 최적화된 부스 관리 및 POS 기능을 만들자는 취지 아래 개발을 진행해 왔습니다.  

비록 정식적인 홍보도, 많은 사용자를 확보하지도 못한 채로 끝을 맞이하지만, 소수의 사용자분들이 실제로 서비스를 이용하며 들려주신 피드백과 응원은 이 프로젝트의 개발 진행뿐만 아니라 제 개인적으로도 큰 힘이 되었습니다. 감사합니다.

---

# MyBoothManager
이 프로젝트는 **부스 및 굿즈 관리**, 행사 현장에서 사용 가능한 **POS 페이지를 통한 굿즈 판매 기록**, 일반 사용자를 위한 **부스/굿즈 정보 공개 페이지** 등 행사에서의 창작자들의 부스 운영과 관리를 돕고 일반 사용자에게 부스와 관련된 정보를 쉽게 제공할 수 있도록 해주는 웹 서비스입니다.

This is a project for **managing booths and goods**, recording order histories with the **field-ready point-of-sale (POS) page**, and **providing public pages for visitors/users** to browse the information about booths and goods.

## Screenshots
<table>
  <thead>
    <tr>
      <th>Admin - Goods</th>
      <th>Admin - POS</th>
      <th>Public - Booth</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><img src="docs/images/v0.5.0-admin-goods-sorakumo.png" alt="MyBoothManager Admin - Goods"></th>
      <th><img src="docs/images/v0.5.0-admin-pos-sorakumo.png" alt="MyBoothManager Admin - POS"></th>
      <th><img src="docs/images/v0.5.0-public-booth-sorakumo.png" alt="MyBoothManager Public - Booth"></th>
    </tr>
  </tbody>

  <caption style="caption-side: bottom"><p align="center"><a href="https://github.com/somnisomni/MyBoothManager/tree/766f2f998a6a15bfa1db9ddf72d360d0982fe8d1">v0.5.0 (766f2f9)</a>, 실제 서비스를 사용한 부스의 스크린샷. <i>Thanks to <a href="https://twitter.com/sd_srkm">sorakumo</a></i></p></caption>
</table>


## Development
### Set up environment
* Initialize the project:
   ```bash
   $ pnpm install && pnpm common:build
   ```
   This will install all dependencies and build the [common](packages/Common) and [common-ui](packages/CommonUI) packages.

* Run the development server of all projects:
   ```bash
   $ pnpm dev
   ```
   This will start the development server for the [frontend admin](projects/Admin), [frontend public](projects/Public), and [backend](projects/Backend) concurrently.

* Apply changes of common packages:
   ```bash
   $ pnpm common:build
   ```
   This will build the [common](packages/Common) and [common-ui](packages/CommonUI) packages.

### Default local development server settings
> To make CORS headers and HTTP cookie work on local environment too, don't navigate to localhost IP address directly.
* **Backend**: [api.sora.localhost:20000](http://api.sora.localhost:20000)
* **Frontend Admin**: [admin.sora.localhost:20001](http://admin.sora.localhost:20001)
* **Frontend Public**: [public.sora.localhost:20002](http://public.sora.localhost:20002)

### Versioning
* This project is *(trying to)* follow [Semantic Versioning](https://semver.org/).
* Also this project is using [`npm version`](https://docs.npmjs.com/cli/commands/npm-version) command to bump the version.
  There is a helper script defined in [root `package.json`](package.json), called `all:version`, which will bump the version of all packages and projects.
  ```bash
  $ pnpm all:version minor  # or major, patch
  ```

### Misc
* In [root `package.json`](package.json), [`@myboothmanager/dev-shared`](packages/DevShared/) is registered as dev dependency. <br />
  This is intended, and is mandatory to make VSCode ESLint plugin work properly in sub-projects which extends the shared ESLint config.

## Copyright & License
Copyright © 2023- **[somni](https://github.com/somnisomni)**, All rights reserved.

This project is licensed under the [PolyForm Strict](LICENSE.md) license. <br>
SPDX: PolyForm-Strict-1.0.0 *([not accepted](https://github.com/spdx/license-list-XML/pull/1018))*
