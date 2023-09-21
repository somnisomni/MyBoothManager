<template>
  <CommonDialog v-model="open"
                dialogTitle="부스 추가"
                dialogCancelText="취소"
                dialogPrimaryText="추가">
    <VForm>
      <VTextField v-model="boothData.name"
                  label="부스명"
                  required
                  :rules="[(v: string) => !!v || '부스 이름을 입력해주세요.']" />
      <VTextField v-model="boothData.description"
                  label="부스 설명" />
      <VTextField v-model="boothData.location"
                  label="부스 위치" />
      <VSelect v-model="boothData.currencySymbol"
               label="통화 기호" />
    </VForm>
  </CommonDialog>
</template>

<script lang="ts">
import type { IBoothCreateRequest } from "@myboothmanager/common";
import { Component, Model, Vue } from "vue-facing-decorator";

@Component({})
export default class BoothAddDialog extends Vue {
  @Model({ type: Boolean, default: false }) open!: boolean;

  boothData: IBoothCreateRequest = {
    name: "",
    description: "",
    location: "",
    currencySymbol: "₩",
  };
}
</script>
