<template>
  <VApp>
    <RouterView />
  </VApp>
</template>

<script lang="ts">
import type { RouteRecordName } from "vue-router";
import { Vue, Component } from "vue-facing-decorator";
import router from "@/router";
import { useAuthStore } from "./stores/auth";
import { useAdminStore } from "./stores/admin";

@Component({})
export default class App extends Vue {
  mounted() {
    // Auth route guard
    router.beforeEach((to, from, next) => {
      const isTokenAvailable = !!useAuthStore().isAuthTokenValid();
      const isAccountDataAvailable = !!useAdminStore().currentAccount;
      const isAllAvailable = isTokenAvailable; /* && isAccountDataAvailable */

      if(isTokenAvailable && !isAccountDataAvailable) {
        // TODO: Fetch account data using existing tokens
      }

      // SuperAdmin
      if(isAllAvailable
         && useAdminStore().currentAccount?.superAdmin
         && !((["superadmin", "logout"] as RouteRecordName[]).includes(to.name!))) {
        next({ name: "superadmin" });
        return;
      }

      // Normal
      if(isAllAvailable && to.name === "login") {
        next({ name: "admin" });
      } else if(!isAllAvailable && to.name !== "login") {
        next({ name: "login" });
      } else {
        next();
      }
    });
  }
}
</script>
