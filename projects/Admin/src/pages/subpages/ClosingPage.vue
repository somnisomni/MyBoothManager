<template>
  <VContainer class="mt-4 pa-2 pa-md-6"
              style="max-width: 700px;">
    <div class="mb-4">
      <h2>굿즈 판매 목록</h2>

      <ul style="list-style: none">
        <li v-for="[ combinationId, data ] in combinationRevenueMap"
            :key="combinationId"
            class="d-flex justify-space-between">
          <span><small class="d-inline-block text-right mr-1" style="width: 3rem; white-space: nowrap; text-wrap: nowrap;">{{ data.quantity }} ×</small> <VIcon icon="mdi-set-all" /> {{ data.name }}</span>
          <span>{{ currencySymbol }}{{ data.totalRevenue.toLocaleString() }} </span>
        </li>

        <li v-for="[ goodsId, data ] in goodsRevenueMap"
            :key="goodsId"
            class="d-flex justify-space-between">
          <span><small class="d-inline-block text-right mr-1" style="width: 3rem; white-space: nowrap; text-wrap: nowrap;">{{ data.quantity }} ×</small> {{ data.name }}</span>
          <span>{{ currencySymbol }}{{ data.totalRevenue.toLocaleString() }}</span>
        </li>

        <li class="d-flex flex-column mt-2">
          <div class="d-flex justify-space-between font-weight-bold"
               style="font-size: 1.25em;">
            <span><small class="d-inline-block text-right mr-1" style="width: 3rem;"></small> 총 판매 수익</span>
            <span>{{ currencySymbol }}{{ totalMergedRevenue.toLocaleString() }}</span>
          </div>

          <ul v-if="paymentTypeRevenueMap.size > 0"
              class="font-weight-light"
              style="padding-left: 4rem; font-size: 0.9em">
            <li v-for="[ paymentType, revenue ] in paymentTypeRevenueMap"
                :key="paymentType"
                class="d-flex justify-space-between">
              <span>└ {{ getPaymentMethodString(paymentType) }}</span>
              <span>{{ currencySymbol }}{{ revenue.toLocaleString() }}</span>
            </li>
          </ul>
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

      <VTabsWindow v-model="memberRevenueDistributionStrategy"
                   class="pa-2">
        <VTabsWindowItem value="own">
          <ul style="list-style: none">
            <li v-for="[ memberId, revenue ] in memberRevenueMap"
                :key="memberId"
                class="d-flex justify-space-between my-1">
              <span>{{ currentBooth.boothMembers![memberId].name }}</span>
              <span>{{ currencySymbol }}{{ revenue.toLocaleString() }}</span>
            </li>

            <li v-if="Array.from(memberRevenueMap.values()).reduce((acc, cur) => acc - cur, totalMergedRevenue) !== 0"
                class="d-flex justify-space-between my-1">
              <span>잔여 금액 <small>(멤버 미지정 굿즈 수익 총합)</small></span>
              <span>{{ currencySymbol }}{{ Array.from(memberRevenueMap.values()).reduce((acc, cur) => acc - cur, totalMergedRevenue).toLocaleString() }}</span>
            </li>
          </ul>
        </VTabsWindowItem>

        <VTabsWindowItem value="equal">
          <ul style="list-style: none">
            <li v-for="member in currentBooth.boothMembers"
                :key="member.id"
                class="d-flex justify-space-between my-1">
              <span>{{ member.name }}</span>
              <span>{{ currencySymbol }}{{ (totalMergedRevenue / Object.values(currentBooth.boothMembers!).length).toLocaleString() }}</span>
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
import { useAdminOrderStore } from "@/plugins/stores/order-utils";
import { getPaymentMethodString } from "@/lib/enum-to-string";

@Component({})
export default class ClosingPage extends Vue {
  readonly getPaymentMethodString = getPaymentMethodString;

  @Setup(() => useAdminStore().currentBooth)
  declare readonly currentBooth: Readonly<ReturnType<typeof useAdminStore>["currentBooth"]>;

  @Setup(() => useAdminStore().currentBoothCurrencyInfo.symbol)
  declare readonly currencySymbol: string;

  @Setup(() => useAdminOrderStore().goodsRevenueMap)
  declare readonly goodsRevenueMap: ReturnType<typeof useAdminOrderStore>["goodsRevenueMap"];

  @Setup(() => useAdminOrderStore().combinationRevenueMap)
  declare readonly combinationRevenueMap: ReturnType<typeof useAdminOrderStore>["combinationRevenueMap"];

  @Setup(() => useAdminOrderStore().memberRevenueMap)
  declare readonly memberRevenueMap: ReturnType<typeof useAdminOrderStore>["memberRevenueMap"];

  @Setup(() => useAdminOrderStore().paymentTypeRevenueMap)
  declare readonly paymentTypeRevenueMap: ReturnType<typeof useAdminOrderStore>["paymentTypeRevenueMap"];

  @Setup(() => useAdminOrderStore().totalMergedRevenue)
  declare readonly totalMergedRevenue: ReturnType<typeof useAdminOrderStore>["totalMergedRevenue"];

  memberRevenueDistributionStrategy: "equal" | "own" = "own";

  beforeCreate() {
    /* if(this.currentBooth.booth && this.currentBooth.booth!.status !== BoothStatus.CLOSE) {
      alert("부스가 운영 종료 상태일 때만 접근할 수 있습니다.");

      router.back();
    } */
  }
}
</script>
