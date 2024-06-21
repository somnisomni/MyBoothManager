<template>
  <div id="error-page" class="d-flex align-center justify-center text-center pa-4"
       style="max-width: 100%;"
       @contextmenu.prevent="prevent">
    <div>
      <div id="error-text">
        <p>{{ error.statusCode }}</p>

        <p id="error-text-href"><a :href="rootRouteUrl"><span>메인 페이지로 이동</span></a></p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { NuxtError } from "#app";
import { Vue, Setup } from "vue-facing-decorator";

@NuxtComponent({})
export default class NotFoundErrorPage extends Vue {
  @Setup(() => useError())
  declare readonly error: NuxtError;

  public mounted() {
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

  prevent(event: Event) {
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

  #error-text {
    margin-top: 0.5em;
    font-size: 2em;
    line-height: 1.25;

    #error-text-href {
      pointer-events: initial !important;

      margin-top: 1em;
      font-size: 0.75em;

      a {
        position: relative;
        overflow: hidden;
        color: #1E88E5;  // text-blue-darken-1
        padding: 0.25em 0.5em;
        text-decoration: none;
        transition: color 0.33s cubic-bezier(0, 0, 0, 1);

        & > * { position: relative; z-index: 1; }

        &::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background-color: #1E88E5;
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.33s cubic-bezier(0, 0, 0, 1);
        }

        &:hover, &:focus {
          color: white;

          &::before {
            transform: scaleX(1);
          }
        }
      }
    }
  }
}
</style>
