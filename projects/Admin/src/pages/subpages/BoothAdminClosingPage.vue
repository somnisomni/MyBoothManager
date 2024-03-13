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

    <h2>goods sell worth map</h2>
    <div v-for="[ goodsId, worth ] in goodsSellWorthMap" :key="goodsId">
      <p>goods #{{ goodsId }}: {{ worth }}</p>
    </div>

    <h2>goods combination sell worth map</h2>
    <div v-for="[ combinationId, worth ] in goodsCombinationSellWorthMap" :key="combinationId">
      <p>combination #{{ combinationId }}: {{ worth }}</p>
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
  get goodsSellWorthMap(): Map<number, number> {
    const map = new Map<number, number>();

    for(const item of Object.values(useAdminStore().currentBooth.goodsOrders!)) {
      for(const goods of Object.values(item.order)) {
        if(goods.gId) {
          const originalPrice = useAdminStore().currentBooth.goods![goods.gId]?.price ?? 0;
          const calculatedPrice = (goods.price ?? originalPrice) * goods.quantity;

          if(map.has(goods.gId)) {
            map.set(goods.gId, map.get(goods.gId)! + calculatedPrice);
          } else {
            map.set(goods.gId, calculatedPrice);
          }
        }
      }
    }

    return map;
  }

  get goodsCombinationSellWorthMap(): Map<number, number> {
    const map = new Map<number, number>();

    for(const item of Object.values(useAdminStore().currentBooth.goodsOrders!)) {
      for(const combination of Object.values(item.order)) {
        if(combination.cId) {
          const originalPrice = useAdminStore().currentBooth.goodsCombinations![combination.cId]?.price ?? 0;
          const calculatedPrice = (combination.price ?? originalPrice) * combination.quantity;

          if(map.has(combination.cId)) {
            map.set(combination.cId, map.get(combination.cId)! + calculatedPrice);
          } else {
            map.set(combination.cId, calculatedPrice);
          }
        }
      }
    }

    return map;
  }

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
