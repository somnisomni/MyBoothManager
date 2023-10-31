<template>
  <VContainer class="w-100 h-100 d-flex align-center justify-center text-center flex-column">
    <VSnackbar v-model="hasLogout" timeout="5000" class="mb-8">로그아웃 되었습니다.</VSnackbar>

    <VCard elevation="8" class="overflow-hidden" style="max-width: 100%; z-index: 1000;">
      <VCardText>
        <div class="text-h4 my-6">부스 관리자 로그인</div>

        <VForm style="width: 400px; max-width: 100%;">
          <VTextField v-model="loginData.loginId"
                      label="로그인 ID"
                      type="text"
                      required
                      autofocus />
          <VTextField v-model="loginData.loginPass"
                      label="패스워드"
                      type="password"
                      required />

          <VExpandTransition>
            <VSheet v-if="errorMessage">
              <VAlert type="error">{{ errorMessage }}</VAlert>
            </VSheet>
          </VExpandTransition>

          <VLayout class="w-100 d-flex flex-row justify-end">
            <VBtn type="submit"
                  class="mt-4 w-100"
                  color="primary"
                  size="large"
                  :loading="loginProgress"
                  :disabled="loginProgress"
                  @click.prevent="doLogin">로그인</VBtn>
          </VLayout>
        </VForm>
      </VCardText>
    </VCard>

    <div class="position-fixed d-block text-center text-subtitle-2 text-grey mb-2" style="bottom: 0; left: 0; right: 0;">
      <span><strong>{{ APP_NAME }}</strong> {{ APP_VERSION }} <small>({{ APP_GIT_HASH }})</small></span><br />
      <span>Copyright © 2023- <a href="https://somni.one/" target="_blank" style="color: currentColor;">somni</a>, All rights reserved.</span>
    </div>
  </VContainer>
</template>

<script lang="ts">
import { APP_NAME, type IAccountLoginRequest } from "@myboothmanager/common";
import { Component, Vue, Watch } from "vue-facing-decorator";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import { useAdminStore } from "@/stores/admin";
import { Const } from "@/lib/const";

@Component({})
export default class LoginPage extends Vue {
  readonly APP_NAME = APP_NAME;
  readonly APP_VERSION = Const.APP_VERSION;
  readonly APP_GIT_HASH = Const.APP_GIT_HASH;

  loginProgress = false;
  loginData: IAccountLoginRequest = {
    loginId: "",
    loginPass: "",
  };

  errorMessage = "";
  hasLogout = window.history.state?.logout ?? false;

  mounted() {
    window.history.state.logout = false;
  }

  async doLogin() {
    this.loginProgress = true;

    const result = await useAuthStore().adminLogin(this.loginData);

    if(result === true) {
      if(useAdminStore().currentAccount?.superAdmin) {
        router.replace({ name: "superadmin" });
      } else {
        router.replace({ name: "admin" });
      }
    } else if(typeof result === "string") {
      this.errorMessage = result;
    }

    this.loginProgress = false;
  }

  @Watch("loginData", { deep: true })
  onLoginFormDataChange() {
    this.errorMessage = "";
  }
}
</script>
