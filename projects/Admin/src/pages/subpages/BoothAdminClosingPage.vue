<template>
  <VContainer class="mt-4 pa-2 pa-md-6">
    <h2>goods</h2>
    <div v-for="[ memberId, goodsIds ] in goodsMemberMap" :key="memberId">
      <h3>member ID #{{ memberId }}</h3>
      <div v-for="goodsId in goodsIds" :key="goodsId">
        <p>have goods #{{ goodsId }}</p>
      </div>
    </div>

    <h2>combinations</h2>
    <div v-for="[ memberId, combinationIds ] in goodsCombinationMemberMap" :key="memberId">
      <h3>member ID #{{ memberId }}</h3>
      <div v-for="combinationId in combinationIds" :key="combinationId">
        <p>have combination #{{ combinationId }}</p>
      </div>
    </div>
  </VContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { BoothStatus } from "@myboothmanager/common";
import { useAdminStore } from "@/stores/admin";
import router from "@/plugins/router";

@Component({})
export default class BoothAdminClosingPage extends Vue {
  get goodsMemberMap(): Map<number, Array<number>> {
    const map = new Map<number, Array<number>>();

    for(const member of Object.values(useAdminStore().currentBooth.boothMembers ?? {})) {
      map.set(member.id,
              Object.values(useAdminStore().currentBooth.goods ?? {}).filter(
                (goods) => goods.ownerMembersId?.includes(member.id),
              ).map((goods) => goods.id));
    }

    return map;
  }

  get goodsCombinationMemberMap(): Map<number, Array<number>> {
    const map = new Map<number, Array<number>>();

    for(const member of Object.values(useAdminStore().currentBooth.boothMembers ?? {})) {
      map.set(member.id,
              Object.values(useAdminStore().currentBooth.goodsCombinations ?? {}).filter(
                (goods) => goods.ownerMemberIds?.includes(member.id),
              ).map((goods) => goods.id));
    }

    return map;
  }

  beforeCreate() {
    if(useAdminStore().currentBooth.booth && useAdminStore().currentBooth.booth!.status !== BoothStatus.CLOSE) {
      alert("부스가 운영 종료 상태일 때만 접근할 수 있습니다.");

      router.back();
    }
  }
}
</script>
