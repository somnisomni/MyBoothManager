<template>
  <DashboardPanel title="굿즈 재고 및 판매 현황">
    <VContainer class="flex-column">
      <VRow>
        <VCol>
          <VSheet class="mx-1"
                  variant="outlined"
                  @click.prevent>
            <VLayout class="px-2 d-flex flex-column align-center">
              <span>유효 주문 기록 개수</span>
              <span class="text-h4 font-weight-bold">{{ validRecordedOrdersCount.toLocaleString() }}개</span>
            </VLayout>
          </VSheet>
        </VCol>

        <VCol>
          <VSheet class="mx-1"
                  variant="outlined"
                  @click.prevent>
            <VLayout class="px-2 d-flex flex-column align-center">
              <span>판매가 기록된 재고 개수</span>
              <span class="text-h4 font-weight-bold">{{ totalSoldStockCount.toLocaleString() }}개</span>
            </VLayout>
          </VSheet>
        </VCol>

        <VCol>
          <VSheet class="mx-1"
                  variant="outlined"
                  @click.prevent>
            <VLayout class="px-2 d-flex flex-column align-center">
              <span>총 판매 수익</span>
              <span class="text-h4 font-weight-bold">{{ currencySymbol }}{{ totalMergedRevenue.toLocaleString() }}</span>
            </VLayout>
          </VSheet>
        </VCol>
      </VRow>

      <VRow style="opacity: 0.5825">
        <VCol>
          <VSheet class="mx-1"
                  variant="outlined"
                  @click.prevent>
            <VLayout class="px-2 d-flex flex-column align-center">
              <span>전체 굿즈 재고 개수/가치</span>
              <span class="text-h4 font-weight-bold">{{ totalGoodsInitialStockCount.toLocaleString() }}개</span>
              <span class="text-h6 font-weight-medium">{{ currencySymbol }}{{ totalGoodsWorthByInitialStock.toLocaleString() }}</span>
            </VLayout>
          </VSheet>
        </VCol>

        <VCol>
          <VSheet class="mx-1"
                  variant="outlined"
                  @click.prevent>
            <VLayout class="px-2 d-flex flex-column align-center">
              <span>남은 굿즈 재고 개수/가치</span>
              <span class="text-h4 font-weight-bold">{{ totalGoodsRemainingStockCount.toLocaleString() }}개</span>
              <span class="text-h6 font-weight-medium">{{ currencySymbol }}{{ totalGoodsWorthByRemainingStock.toLocaleString() }}</span>
            </VLayout>
          </VSheet>
        </VCol>

        <VCol>
          <VSheet class="mx-1 text-center"
                  variant="outlined"
                  @click.prevent>
            <VLayout class="px-2">
              <div v-if="!isRemainingStockMismatchWithOrderHistory"
                   class="d-flex flex-column align-center text-success">
                <VIcon icon="mdi-check-circle-outline"
                      size="x-large" />
                <span class="mt-2" style="word-break: keep-all; font-size: 0.9em; line-height: 1.2;"> 판매 기록과 등록된 굿즈들의 재고 개수 차이가 일치함</span>
              </div>
              <div v-else
                   class="d-flex flex-column align-center text-warning">
                <VIcon icon="mdi-alert-outline"
                      size="x-large" />
                <span class="mt-2" style="word-break: keep-all; font-size: 0.9em; line-height: 1.2;"> 판매 기록과 등록된 굿즈들의 재고 개수 차이가 일치하지 않음
                  <VBtn icon="mdi-help-circle"
                        size="x-small"
                        variant="text"
                        @click="stockMismatchDialogShown = true" />
                </span>
              </div>
            </VLayout>
          </VSheet>
        </VCol>
      </VRow>
    </VContainer>

    <CommonDialog v-model="stockMismatchDialogShown"
                  dialogTitle="굿즈 재고 개수 미일치 안내"
                  dialogPrimaryText="닫기"
                  :dialogCancelText="null"
                  @primary="stockMismatchDialogShown = false">
      <p>전체 굿즈 재고 개수에서 남은 굿즈 재고 개수를 뺀 값과 판매가 기록된 재고 개수가 서로 다르면 이 경고가 표시됩니다.</p><br />

      <p>판매 수익 계산이 부정확해지는 등 문제가 발생할 수 있어 <strong>개별 굿즈의 현재 재고 개수를 굿즈 관리 페이지에서 직접 수정하는 것은 권장하지 않습니다.</strong></p>
      <!-- <p>만약 굿즈가 판매는 되었지만 기록이 누락된 건이 있다면, 잠시 부스를 운영 상태로 전환한 후 POS 페이지에서 누락된 만큼 판매 기록을 생성할 수도 있습니다.</p> --><br />

      <p>현재 굿즈 등록 정보 상 재고 수 차이는 <strong>{{ totalGoodsStockDifference.toLocaleString() }}개</strong> 입니다.</p>
      <p>판매 기록을 취합하여 계산된 소진 재고 수는 <strong>{{ totalSoldStockCount.toLocaleString() }}개</strong> 입니다.</p>
      <p>총 <strong>{{ Math.abs(totalGoodsStockDifference - totalSoldStockCount) }}개</strong>의 괴리가 발생하였습니다.</p>
    </CommonDialog>
  </DashboardPanel>
</template>

<script lang="ts">
import { Component, Setup, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/plugins/stores/admin";
import { useAdminOrderStore } from "@/plugins/stores/order-utils";
import { useAdminGoodsStore } from "@/plugins/stores/goods-utils";
import DashboardPanel from "./DashboardPanel.vue";

@Component({
  components: {
    DashboardPanel,
  },
})
export default class GoodsOverviewPanel extends Vue {
  @Setup(() => useAdminStore().currentBoothCurrencyInfo.symbol)
  declare readonly currencySymbol: string;

  @Setup(() => useAdminOrderStore().validRecordedOrdersCount)
  declare readonly validRecordedOrdersCount: number;

  @Setup(() => useAdminOrderStore().totalSoldStockCount)
  declare readonly totalSoldStockCount: number;

  @Setup(() => useAdminOrderStore().totalMergedRevenue)
  declare readonly totalMergedRevenue: number;

  @Setup(() => useAdminGoodsStore().totalGoodsInitialStockCount)
  declare readonly totalGoodsInitialStockCount: number;

  @Setup(() => useAdminGoodsStore().totalGoodsWorthByInitialStock)
  declare readonly totalGoodsWorthByInitialStock: number;

  @Setup(() => useAdminGoodsStore().totalGoodsRemainingStockCount)
  declare readonly totalGoodsRemainingStockCount: number;

  @Setup(() => useAdminGoodsStore().totalGoodsWorthByRemainingStock)
  declare readonly totalGoodsWorthByRemainingStock: number;

  @Setup(() => useAdminGoodsStore().totalGoodsStockDifference)
  declare readonly totalGoodsStockDifference: number;

  stockMismatchDialogShown: boolean = false;

  get isRemainingStockMismatchWithOrderHistory(): boolean {
    return this.totalGoodsStockDifference !== this.totalSoldStockCount;
  }
}
</script>
