<template>
  <VContainer class="mt-4 pa-2 pa-md-6"
              style="max-width: 700px;">
    <div class="mb-4">
      <h2>굿즈 판매 목록</h2>

      <ul style="list-style: none">
        <li v-for="[ combinationId, data ] in goodsCombinationRevenueMap"
            :key="combinationId"
            class="d-flex justify-space-between">
          <span><small class="d-inline-block text-right mr-1" style="width: 4em; white-space: nowrap; text-wrap: nowrap;">{{ data.quantity }} ×</small> <VIcon icon="mdi-set-all" /> {{ data.name }}</span>
          <span>{{ currencySymbol }}{{ data.total.toLocaleString() }} </span>
        </li>

        <li v-for="[ goodsId, data ] in goodsRevenueMap"
            :key="goodsId"
            class="d-flex justify-space-between">
          <span><small class="d-inline-block text-right mr-1" style="width: 4em; white-space: nowrap; text-wrap: nowrap;">{{ data.quantity }} ×</small> {{ data.name }}</span>
          <span>{{ currencySymbol }}{{ data.total.toLocaleString() }}</span>
        </li>

        <li class="d-flex justify-space-between font-weight-bold">
          <span><small class="d-inline-block text-right mr-1" style="width: 4em;"></small> 총 판매 수익</span>
          <span>{{ currencySymbol }}{{ totalRevenue.toLocaleString() }}</span>
        </li>
      </ul>
    </div>

    <VDivider class="my-4" />

    <div v-if="Object.values(currentBooth.boothMembers ?? { }).length > 0"
         class="mb-4">
      <h2>멤버 수익 분배</h2>

      <VTabs v-model="memberRevenueDistributionStrategy"
             fixed-tabs>
        <VTab value="own">소유 굿즈별 분배</VTab>
        <VTab value="equal">동률 분배 (1/N)</VTab>
      </VTabs>

      <VTabsWindow v-model="memberRevenueDistributionStrategy">
        <VTabsWindowItem value="own">
          <ul style="list-style: none">
            <li v-for="[ memberId, revenue ] in memberRevenueMap"
                :key="memberId"
                class="d-flex justify-space-between">
              <span>{{ currentBooth.boothMembers![memberId].name }}</span>
              <span>{{ currencySymbol }}{{ revenue.toLocaleString() }}</span>
            </li>

            <li v-if="Array.from(memberRevenueMap.values()).reduce((acc, cur) => acc - cur, totalRevenue) !== 0"
                class="d-flex justify-space-between">
              <span>잔여 금액 <small>(멤버 미지정 굿즈 수익 총합)</small></span>
              <span>{{ currencySymbol }}{{ Array.from(memberRevenueMap.values()).reduce((acc, cur) => acc - cur, totalRevenue).toLocaleString() }}</span>
            </li>
          </ul>
        </VTabsWindowItem>

        <VTabsWindowItem value="equal">
          <ul style="list-style: none">
            <li v-for="member in currentBooth.boothMembers"
                :key="member.id"
                class="d-flex justify-space-between">
              <span>{{ member.name }}</span>
              <span>{{ currencySymbol }}{{ (totalRevenue / Object.values(currentBooth.boothMembers!).length).toLocaleString() }}</span>
            </li>
          </ul>
        </VTabsWindowItem>
      </VTabsWindow>
    </div>
  </VContainer>
</template>

<script lang="ts">
import { Component, Setup, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/plugins/stores/admin";

type GoodsWorthMapItem = { name: string, quantity: number, total: number, memberLength?: number };

@Component({})
export default class ClosingPage extends Vue {
  @Setup(() => useAdminStore().currentBooth)
  declare readonly currentBooth: Readonly<ReturnType<typeof useAdminStore>["currentBooth"]>;

  @Setup(() => useAdminStore().currentBooth.booth?.currencySymbol)
  declare readonly currencySymbol: string;

  memberRevenueDistributionStrategy: "equal" | "own" = "own";

  get goodsRevenueMap(): Map<number, GoodsWorthMapItem> {
    const map = new Map<number, GoodsWorthMapItem>();

    for(const item of Object.values(this.currentBooth.goodsOrders!)) {
      for(const goods of Object.values(item.order)) {
        if(goods.gId) {
          const originalGoods = this.currentBooth.goods![goods.gId];
          const originalPrice = originalGoods?.price ?? 0;
          const calculatedPrice = (goods.price ?? originalPrice) * goods.quantity;

          if(map.has(goods.gId)) {
            map.set(goods.gId, {
              name: goods.name ?? originalGoods?.name,
              quantity: map.get(goods.gId)!.quantity + goods.quantity,
              total: map.get(goods.gId)!.total + calculatedPrice,
              memberLength: originalGoods?.ownerMemberIds?.length,
            });
          } else {
            map.set(goods.gId, {
              name: goods.name ?? originalGoods?.name,
              quantity: goods.quantity,
              total: calculatedPrice,
              memberLength: originalGoods?.ownerMemberIds?.length,
            });
          }
        }
      }
    }

    return new Map(Array.from(map.entries()).sort((a, b) => a[1].name.localeCompare(b[1].name)));
  }

  get goodsCombinationRevenueMap(): Map<number, GoodsWorthMapItem> {
    const map = new Map<number, GoodsWorthMapItem>();

    for(const item of Object.values(this.currentBooth.goodsOrders!)) {
      for(const combination of Object.values(item.order)) {
        if(combination.cId) {
          const originalCombination = this.currentBooth.goodsCombinations![combination.cId];
          const originalPrice = originalCombination?.price ?? 0;
          const calculatedPrice = (combination.price ?? originalPrice) * combination.quantity;

          if(map.has(combination.cId)) {
            map.set(combination.cId, {
              name: combination.name ?? originalCombination?.name,
              quantity: map.get(combination.cId)!.quantity + combination.quantity,
              total: map.get(combination.cId)!.total + calculatedPrice,
              memberLength: originalCombination?.ownerMemberIds?.length,
            });
          } else {
            map.set(combination.cId, {
              name: combination.name ?? originalCombination?.name,
              quantity: combination.quantity,
              total: calculatedPrice,
              memberLength: originalCombination?.ownerMemberIds?.length,
            });
          }
        }
      }
    }

    return new Map(Array.from(map.entries()).sort((a, b) => a[1].name.localeCompare(b[1].name)));
  }

  get totalRevenue(): number {
    return Array.from(this.goodsRevenueMap.values()).reduce((acc, cur) => acc + cur.total, 0) +
           Array.from(this.goodsCombinationRevenueMap.values()).reduce((acc, cur) => acc + cur.total, 0);
  }

  get goodsMemberMap(): Map<number, Array<number>> {
    const map = new Map<number, Array<number>>();

    for(const member of Object.values(this.currentBooth.boothMembers ?? {})) {
      map.set(member.id,
              Object.values(this.currentBooth.goods ?? {}).filter(
                (goods) => goods.ownerMemberIds?.includes(member.id),
              ).map((goods) => goods.id));
    }

    return map;
  }

  get goodsCombinationMemberMap(): Map<number, Array<number>> {
    const map = new Map<number, Array<number>>();

    for(const member of Object.values(this.currentBooth.boothMembers ?? {})) {
      map.set(member.id,
              Object.values(this.currentBooth.goodsCombinations ?? {}).filter(
                (goods) => goods.ownerMemberIds?.includes(member.id),
              ).map((goods) => goods.id));
    }

    return map;
  }

  get memberRevenueMap(): Map<number, number> {
    const map = new Map<number, number>();

    for(const member of Object.values(this.currentBooth.boothMembers ?? {})) {
      const goodsTotal = this.goodsMemberMap.get(member.id)!
        .map((goodsId) => {
          const rev = this.goodsRevenueMap.get(goodsId);
          return rev ? rev.total / (rev.memberLength ?? 1) : 0;
        }).reduce((acc, cur) => acc + cur, 0);
      const combinationTotal = this.goodsCombinationMemberMap.get(member.id)!
        .map((combinationId) => {
          const rev = this.goodsCombinationRevenueMap.get(combinationId);
          return rev ? rev.total / (rev.memberLength ?? 1) : 0;
        }).reduce((acc, cur) => acc + cur, 0);

      map.set(member.id, goodsTotal + combinationTotal);
    }

    return map;
  }

  beforeCreate() {
    /* if(this.currentBooth.booth && this.currentBooth.booth!.status !== BoothStatus.CLOSE) {
      alert("부스가 운영 종료 상태일 때만 접근할 수 있습니다.");

      router.back();
    } */
  }
}
</script>
