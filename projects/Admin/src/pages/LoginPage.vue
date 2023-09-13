<template>
  <VContainer class="w-100 h-100 d-flex align-center justify-center text-center flex-column">
    <div class="text-h4 mb-6">부스 관리자 로그인</div>

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

      <VLayout class="w-100 d-flex flex-row justify-end">
        <VBtn type="submit"
              class="mt-4"
              color="primary"
              size="large"
              @click.prevent="doLogin">로그인</VBtn>
      </VLayout>
    </VForm>
  </VContainer>
</template>

<script lang="ts">
import AdminAPI from "@/lib/api-admin";
import { Component, Vue } from "vue-facing-decorator";

@Component({})
export default class LoginPage extends Vue {
  loginData = {
    loginId: "",
    loginPass: "",
  };

  async doLogin() {
    alert(await AdminAPI.login(this.loginData));
  }
}
</script>
