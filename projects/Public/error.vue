<template>
  <div id="error-page"
       class="d-flex flex-column align-center justify-center text-center pa-4"
       style="max-width: 100%;"
       @contextmenu.prevent="prevent">
    <p id="error-status-code-text">{{ error.statusCode }}</p>
    <p class="mt-2 text-subtitle-1 text-warning">
      <span v-if="error.statusCode === 404">존재하지 않는 페이지입니다.</span>
      <span v-else>처리할 수 없는 오류가 발생했습니다. <br> 개발자 또는 서비스 운영자에게 문의해주세요.</span>
    </p>

    <VBtn class="allow-pointer-events mt-4"
          size="large"
          color="primary"
          variant="outlined"
          prependIcon="mdi-home"
          :to="{ path: '/' }">
      메인 페이지로 이동
    </VBtn>
  </div>
</template>

<script lang="ts">
import type { NuxtError } from "#app";
import { Vue, Setup } from "vue-facing-decorator";

@NuxtComponent({})
export default class NotFoundErrorPage extends Vue {
  @Setup(() => useError())
  declare readonly error: NuxtError;

  mounted(): void {
    document.addEventListener("contextmenu", this.prevent);
    document.addEventListener("copy", this.prevent);
    document.addEventListener("cut", this.prevent);
    document.addEventListener("drag", this.prevent);

    console.warn("아래 오류 데이터를 개발자에게 제보해주세요.\nPlease send the error data below to the developer.");
    console.error(`${this.error.message}\n\n${this.error.stack}`);
  }

  get rootRouteUrl(): string {
    return useRuntimeConfig().app.baseURL ?? "/";
  }

  prevent(event: Event): boolean {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
}
</script>

<style lang="scss" scoped>
#error-page {
  pointer-events: none;
  -webkit-user-select: none;
          user-select: none;
  -webkit-user-drag: none;
          user-drag: none;

  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .allow-pointer-events {
    pointer-events: auto;
  }

  #error-status-code-text {
    margin-top: 0.5em;
    font-size: 5em;
    line-height: 1.25;
  }
}
</style>
