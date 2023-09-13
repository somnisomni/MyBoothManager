<template>
  <VApp>
    <RouterView />
  </VApp>
</template>

<script lang="ts">
import { inject } from "vue";
import { Vue, Component } from "vue-facing-decorator";
import { type VueCookies } from "vue-cookies";
import router from "@/router";

@Component({})
export default class App extends Vue {
  mounted() {
    const $cookies = inject<VueCookies>("$cookies");

    // Auth route guard
    if($cookies) {
      router.beforeEach((to, from, next) => {
        const isCurrentAccountAvailable = !!$cookies.get("currentAccount");
        const isAccessTokenAvailable = !!$cookies.get("accessToken");
        const isAllAvailable = isCurrentAccountAvailable && isAccessTokenAvailable;

        if(isAllAvailable && to.name === "login") {
          next({ name: "admin" });
        } else if(!isAllAvailable && to.name !== "login") {

          next({ name: "login" });
        } else {
          next();
        }
      });
    } else {
      alert("Cookie initialization failed.");
    }
  }
}
</script>
