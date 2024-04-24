<template>
  <VContainer class="w-100 h-100 d-flex align-center justify-center text-center flex-column" style="word-break: keep-all">
    <VSnackbar v-model="hasLogout" timeout="5000" class="mb-8">
      <span v-if="hasLogoutByInvalidAuthToken">로그인 정보가 유효하지 않아 다시 로그인해야 합니다.</span>
      <span v-else>로그아웃 되었습니다.</span>
    </VSnackbar>

    <VCard elevation="8" class="overflow-hidden" style="max-width: 100%; z-index: 1000;">
      <VCardText>
        <div class="text-h4 my-6">부스 관리자 로그인</div>

        <VForm v-model="formValid" style="width: 400px; max-width: 100%;">
          <VTextField v-model="loginData.loginId"
                      class="my-2"
                      label="로그인 ID"
                      type="text"
                      required
                      autofocus
                      :rules="[ () => loginData.loginId.length <= 0 ? 'ID를 입력하세요.' : true ]"/>
          <VTextField v-model="loginData.loginPass"
                      class="my-2"
                      label="패스워드"
                      type="password"
                      required
                      :rules="[ () => loginData.loginPass.length <= 0 ? '패스워드를 입력하세요.' : true ]"/>

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
                  :disabled="loginProgress || !formValid"
                  @click.prevent="doLogin(false)">로그인</VBtn>
          </VLayout>
        </VForm>

        <p class="text-caption mt-4 text-disabled">현재 계정 생성 및 패스워드 변경 등은 신청을 받아 직접 처리하고 있습니다.<br />개발자에게 문의해주세요.</p>
      </VCardText>
    </VCard>

    <div class="position-fixed d-block text-center text-subtitle-2 text-grey mb-2" style="bottom: 0; left: 0; right: 0;">
      <span><strong>{{ APP_NAME }}</strong> {{ APP_VERSION }} <small>({{ APP_GIT_HASH }})</small></span><br />
      <span>Copyright © 2023- <a href="https://somni.one/" target="_blank" style="color: currentColor;">somni</a>, All rights reserved.</span>
    </div>

    <CommonWarningDialog v-model="confirmLoginDialogShown"
                         dialogTitle="로그인 확인"
                         headlineText="이미 다른 곳에서 로그인되어 있습니다."
                         primaryText="로그인"
                         cancelText="취소"
                         @primary="doLogin(true)"
                         @cancel="confirmLoginDialogShown = false">
      <p>기존 세션을 끊고 로그인하시겠습니까?</p>
    </CommonWarningDialog>
  </VContainer>
</template>

<script lang="ts">
import { APP_NAME, ErrorCodes, type IAccountLoginRequest } from "@myboothmanager/common";
import { Component, Vue, Watch } from "vue-facing-decorator";
import router from "@/plugins/router";
import { useAuthStore } from "@/plugins/stores/auth";
import { useAdminStore } from "@/plugins/stores/admin";
import { Const } from "@/lib/const";

@Component({})
export default class LoginPage extends Vue {
  readonly APP_NAME = APP_NAME;
  readonly APP_VERSION = Const.APP_VERSION;
  readonly APP_GIT_HASH = Const.APP_GIT_HASH;

  formValid = false;
  loginProgress = false;
  loginData: IAccountLoginRequest = {
    loginId: "",
    loginPass: "",
  };

  errorMessage = "";
  hasLogout = window.history.state?.logout ?? false;
  hasLogoutByInvalidAuthToken = window.history.state?.authTokenInvalid ?? false;
  confirmLoginDialogShown = false;

  mounted() {
    window.history.state.logout = false;
  }

  async doLogin(confirm?: boolean) {
    this.loginProgress = true;

    let result;
    try {
      result = await useAuthStore().adminLogin({
        ...this.loginData,
        confirmLogoutExistingSession: confirm,
      });
    } catch(err) {
      result = ErrorCodes.UNKNOWN_ERROR;
    }

    if(result === true) {
      if(useAdminStore().currentAccount?.superAdmin) {
        router.replace({ name: "superadmin" });
      } else {
        router.replace({ name: "admin" });
      }
    } else if(typeof result === "number") {
      switch(result) {
        case ErrorCodes.ENTITY_NOT_FOUND:
          this.errorMessage = "로그인 ID 또는 패스워드가 잘못되었습니다.";
          break;
        case ErrorCodes.ACCOUNT_BANNED:
          this.errorMessage = "정지된 계정입니다.";
          break;
        case ErrorCodes.ACCOUNT_DISABLED:
          this.errorMessage = "비활성화된 계정입니다.";
          break;
        case ErrorCodes.SESSION_ALREADY_EXISTS:
          this.confirmLoginDialogShown = true;
          break;
        case ErrorCodes.UNKNOWN_ERROR:
          this.errorMessage = "지정되지 않은 오류 또는 서버 API 호출 중 오류가 발생했습니다.";
          break;
        default:
          this.errorMessage = `로그인 중 알 수 없는 오류가 발생했습니다. (${result})`;
          break;
      }
    }

    this.loginProgress = false;
  }

  @Watch("loginData", { deep: true })
  onLoginFormDataChange() {
    this.errorMessage = "";
  }
}
</script>
