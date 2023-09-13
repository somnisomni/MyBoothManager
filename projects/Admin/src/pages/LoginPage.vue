<template>
  <VContainer class="w-100 h-100 d-flex align-center justify-center text-center flex-column">
    <VCard elevation="8" style="overflow: hidden">
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
                  @click.prevent="doLogin">로그인</VBtn>
          </VLayout>
        </VForm>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import { VExpandTransition, VSlideXReverseTransition } from "vuetify/components";

@Component({})
export default class LoginPage extends Vue {
  loginProgress = false;
  loginData = {
    loginId: "",
    loginPass: "",
  };

  errorMessage = "";

  async doLogin() {
    this.loginProgress = true;

    const result = await useAdminStore().adminLogin(this.loginData.loginId, this.loginData.loginPass);

    if(result === true) {
      alert("success!");
    } else if(typeof result === "string") {
      this.errorMessage = result;
    }

    this.loginProgress = false;
  }
}
</script>
