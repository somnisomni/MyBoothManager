<template>
  <VApp class="bg-background">
    <div class="d-flex"
         style="min-height: 100vh">
      <slot v-if="!isServerNotAvailable"></slot>
    </div>

    <VFooter color="blue-grey-lighten-5"
             class="text-blue-grey-lighten-1">
      <VContainer>
        <p><span class="text-h6 font-weight-bold">{{ APP_NAME }}</span> {{ versionString }}</p>
        <p v-if="isRollingVersion" class="text-subtitle-2 font-weight-light">비안정 버전으로 서비스 운영 중입니다. 예기치 않은 버그가 존재할 수 있고, UI 레이아웃 및 기능이 예고 없이 변경될 수 있습니다.</p>
        <p v-if="isStagingEnv" class="text-subtitle-2 font-weight-light">테스트를 위해 배포 중인 사이트입니다. 수시로 기능이 변경되거나 각종 버그 발생, 또는 작동이 멈출 수 있습니다.</p>

        <p class="mt-4">© 2023- somni</p>
        <p>사용 문의 · 피드백 · 부스 관리 계정 생성 요청: <a :href="`https://twitter.com/${DEVELOPER_TWITTER_HANDLE}`" target="_blank" style="color: currentColor"><VIcon icon="mdi-twitter" size="small" /></a></p>
      </VContainer>
    </VFooter>

    <ServerNotRespondErrorDialog v-model="isServerNotAvailable" />
  </VApp>
</template>

<script lang="ts">
import { Vue, Setup } from "vue-facing-decorator";
import { APP_NAME, DEVELOPER_TWITTER_HANDLE } from "@myboothmanager/common";

@NuxtComponent({})
export default class RootLayout extends Vue {
  readonly APP_NAME = APP_NAME;
  readonly DEVELOPER_TWITTER_HANDLE = DEVELOPER_TWITTER_HANDLE;

  @Setup(() => useRuntimeConfig().public.appVersion)
  declare readonly appVersion: string;

  @Setup(() => useRuntimeConfig().public.versionGitHash)
  declare readonly gitHash: string;

  isServerNotAvailable: boolean = false;

  get versionString(): string {
    return `v${this.appVersion} (${this.gitHash})`;
  }

  get isRollingVersion(): boolean {
    return this.appVersion.startsWith("0.") || this.appVersion.endsWith("-dev") || this.appVersion.endsWith("-beta");
  }

  get isStagingEnv(): boolean {
    if(!window) return false;

    return window?.location.hostname.includes("staging");
  }

  async mounted() {
    this.isServerNotAvailable = !(await this.$publicAPI.apiCaller.checkAPIServerAlive());
  }
}
</script>
