<template>
  <div id="error-page" class="d-flex align-center justify-center text-center"
       @contextmenu.prevent="prevent">
    <div>
      <video id="error-image" autoplay loop muted playsinline poster="@/res/images/error_jeomo.png">
        <source src="@/res/images/error_jeomo_anim.webm" type="video/webm" />
        <source src="@/res/images/error_jeomo.png" type="image/png" />
      </video>

      <div id="error-text">
        <p style="font-size: 2em"><strong>404.</strong></p>
        <p style="font-weight: 300">곤란. 페이지를 찾을 수 없습니다.</p>

        <p id="error-text-href"><a :href="rootRouteUrl"><span>관리자 페이지로 이동</span></a></p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-facing-decorator";
import router from "@/router";

@Component({})
export default class NotFoundErrorPage extends Vue {
  public mounted() {
    document.addEventListener("contextmenu", this.prevent);
    document.addEventListener("copy", this.prevent);
    document.addEventListener("cut", this.prevent);
    document.addEventListener("drag", this.prevent);
  }

  get rootRouteUrl(): string {
    return router.resolve({ name: "admin" }).href ?? (import.meta.env.BASE_URL ?? "/");
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

  #error-image {
    height: 50vh;
  }

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
