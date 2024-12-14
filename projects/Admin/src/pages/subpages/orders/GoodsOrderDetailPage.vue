<template>
  <VContainer class="pa-0 pa-sm-2 pa-md-6">
    <h2 v-if="!orderId"
        class="text-error">
      <span>잘못된 접근입니다.</span>
    </h2>
    <VLayout v-else
             class="pa-2 justify-start">
      <VBtn :to="{ name: 'admin-orders' }"
            size="large"
            variant="text"
            prependIcon="mdi-arrow-left"
            :active="false"
            replace>
        <span>판매 기록 목록으로</span>
      </VBtn> <!-- :active is workaround -->
    </VLayout>

    <VDivider class="my-2" />

    <div v-if="orderData">
      <VContainer class="pa-0"
                  style="width: 500px; max-width: 100%;">
        <div ref="orderContentDOM"
             class="pa-4">
          <!-- Topmost order ID / status -->
          <div class="order-detail-inner">
            <span class="text-grey font-weight-light">#{{ orderId }}</span>

            <div class="font-weight-medium text-right flex-1-0">
              <span v-if="orderData.status === GoodsOrderStatus.RECORDED"
                    class="d-inline-flex align-center text-green-darken-2"><VIcon icon="mdi-check"
                                                                                  class="mr-1" /> 정상 기록됨</span>
              <span v-else-if="orderData.status === GoodsOrderStatus.CANCELED"
                    class="d-inline-flex align-center text-pink-lighten-2"><VIcon icon="mdi-undo-variant"
                                                                                  class="mr-1" /> 취소됨</span>
            </div>
          </div>

          <!-- Date / order total price -->
          <div class="order-detail-inner my-4">
            <div />

            <div class="d-flex flex-column align-end justify-center text-right flex-1-0">
              <div class="text-body-2">이 판매 기록의 총 매출액</div>
              <div class="text-h4 text-sm-h3 font-weight-bold">{{ currencySymbol }}{{ orderData.totalRevenue.toLocaleString() }}</div>
            </div>
          </div>

          <VDivider class="my-2" />

          <!-- Order history created date -->
          <div class="order-detail-inner">
            <span class="font-weight-bold">판매 기록 일자</span>

            <div class="d-flex align-center justify-end text-right flex-1-0">
              <span style="font-size: 90%;">{{ new Date(orderData.createdAt!).toLocaleDateString() }}</span>
              <span class="ml-1 font-weight-medium">{{ new Date(orderData.createdAt!).toLocaleTimeString() }}</span>
            </div>
          </div>

          <!-- Payment method -->
          <div v-if="orderData.paymentMethod"
               class="order-detail-inner">
            <span class="font-weight-bold">결제 방법</span>

            <span>{{ getPaymentMethodString(orderData.paymentMethod) }}</span>
          </div>

          <VDivider class="my-2" />

          <!-- Goods items header -->
          <div class="order-detail-inner text-disabled my-2"
               style="font-size: 80%;">
            <span>굿즈/세트명</span>
            <span>단가 <small>× 개수</small></span>
          </div>

          <!-- Goods items -->
          <ul style="list-style: none; padding: 0 2em;">
            <li v-for="order in ordersSorted"
                :key="(order.gId || order.cId)"
                class="order-detail-inner my-1 px-0">
              <div>
                <div>
                  <VIcon v-if="order.cId"
                         size="small">
                    mdi-set-all
                  </VIcon> {{ order.name }}
                </div>

                <ul v-if="order.cId"
                    style="margin-inline-start: 2em">
                  <li v-for="combinedGoods in order.combinedGoods"
                      :key="combinedGoods.gId">
                    <span>{{ combinedGoods.name }}</span>
                  </li>
                </ul>
              </div>

              <div class="text-right flex-1-0">
                <span v-if="order.price"
                      class="font-weight-medium">{{ currencySymbol }}{{ order.price.toLocaleString() }}</span>
                <span v-else-if="!order.price || order.price === 0"
                      class="font-weight-medium">무료 증정</span>
                <span v-else>?</span>

                <small> × {{ order.quantity.toLocaleString() }}</small>
              </div>
            </li>
          </ul>

          <VDivider class="my-2" />

          <!-- Summary -->
          <div class="order-detail-inner">
            <span class="font-weight-bold">총 소진 재고 개수 <small>(세트 포함)</small></span>
            <span class="text-right flex-1-0">{{ totalStockQuantity.toLocaleString() }}개</span>
          </div>

          <!-- Capture detail -->
          <div class="order-detail-inner capture-detail">
            <span class="font-weight-bold">기록 캡처 일시</span>
            <span class="text-right flex-1-0">{{ new Date().toLocaleString() }}</span>
          </div>

          <div class="order-detail-inner capture-detail mt-4">
            <div />
            <small class="text-right flex-1-0 font-weight-light">
              <div>부스명: <span class="font-weight-bold">{{ currentBoothName }}</span></div>
              <div>Created using <span class="font-weight-medium">{{ APP_NAME }}</span></div>
            </small>
          </div>
        </div>

        <!-- Cancel order button -->
        <div class="order-detail-inner mt-2">
          <VBtn class="mt-2"
                prependIcon="mdi-image"
                :loading="isCreatingOrderContentAsImage"
                :disabled="isCreatingOrderContentAsImage"
                @click="createOrderContentAsImage">
            <span>이미지로 캡처</span>
          </VBtn>

          <VBtn v-if="orderData.status !== GoodsOrderStatus.CANCELED"
                class="mt-2"
                @click="cancelOrderWarningDialogShown = true">
            <span>판매 기록 취소</span>
          </VBtn>
        </div>
      </VContainer>
    </div>
    <h2 v-else>유효하지 않은 판매 기록입니다.</h2>

    <CommonWarningDialog v-model="cancelOrderWarningDialogShown"
                         dialogTitle="판매 기록 취소 확인"
                         headlineText="판매 기록을 취소 처리하면 다시 기록 상태로 복원할 수 없습니다."
                         cancelText="취소"
                         primaryText="확인"
                         @primary="cancelOrder">
      <p>취소 처리하면 기록된 굿즈들의 재고 수량이 복구됩니다.</p>
      <p>계속하시겠습니까?</p>
    </CommonWarningDialog>
  </VContainer>
</template>

<script lang="ts">
import type { IBooth, IGoodsOrder, IGoodsOrderItem } from "@myboothmanager/common";
import type { RouteRecordRaw } from "vue-router";
import { APP_NAME, GoodsOrderStatus } from "@myboothmanager/common";
import html2canvas from "html2canvas";
import { Component, Hook, Ref, Setup, toNative, Vue } from "vue-facing-decorator";
import { useRoute } from "vue-router";
import { getPaymentMethodString } from "@/lib/enum-to-string";
import { useAdminStore } from "@/plugins/stores/admin";
import { useAdminAPIStore } from "@/plugins/stores/api";

@Component({})
class GoodsOrderDetailPage extends Vue {
  readonly APP_NAME = APP_NAME;
  readonly GoodsOrderStatus = GoodsOrderStatus;
  readonly getPaymentMethodString = getPaymentMethodString;

  cancelOrderWarningDialogShown = false;
  isCreatingOrderContentAsImage = false;

  @Ref("orderContentDOM")
  declare readonly orderContentDOM: HTMLElement;

  @Setup(() => useRoute().params.id)
  declare readonly orderId: number;

  // TODO: Use currency symbol from orderData, after backend is updated
  @Setup(() => useAdminStore().currentBoothCurrencyInfo.symbol)
  declare readonly currencySymbol: string;

  async mounted(): Promise<void> {
    if(!this.orderData) {
      // If order data is not fetched yet, try to fetch it
      await useAdminAPIStore().fetchGoodsOrdersOfCurrentBooth();
    }
  }

  @Hook
  beforeRouteLeave(to: RouteRecordRaw, from: RouteRecordRaw): void {
    to.meta = { previousScrollOffset: from.meta?.previousScrollOffset };
  }

  get currentBoothName(): string {
    return (useAdminStore().currentBooth.booth as IBooth).name;
  }

  get orderData(): IGoodsOrder {
    return (useAdminStore().currentBooth.orders as Record<number, IGoodsOrder>)[this.orderId];
  }

  get ordersSorted(): IGoodsOrderItem[] {
    return this.orderData.order.sort((a, b) => {
      if(a.cId && b.cId) {
        return a.cId - b.cId;
      } else if(a.cId) {
        return -1;
      } else if(b.cId) {
        return 1;
      } else {
        return (a.gId || 0) - (b.gId || 0);
      }
    });
  }

  get totalStockQuantity(): number {
    return this.orderData.order.reduce((acc, cur) => {
      let quantity = cur.quantity;
      if(cur.cId && cur.combinedGoods) {
        quantity = cur.combinedGoods?.length * cur.quantity;
      }

      return acc + quantity;
    }, 0);
  }

  async cancelOrder(): Promise<void> {
    const response = await useAdminAPIStore().updateGoodsOrderStatus(this.orderId, { status: GoodsOrderStatus.CANCELED });

    if(response === true) {
      // TODO: further process
    }
  }

  async createOrderContentAsImage(): Promise<void> {
    this.isCreatingOrderContentAsImage = true;

    const canvas = await html2canvas(this.orderContentDOM, {
      backgroundColor: "white",
      width: 500,
      windowWidth: 1000,
      scale: 2,
      onclone(_, element) {
        element.querySelectorAll(".capture-detail").forEach((el) => {
          (el as HTMLElement).style.display = "flex";
        });
      },
    });

    const link = document.createElement("a");
    link.download = `${this.currentBoothName}-order-${this.orderId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    this.isCreatingOrderContentAsImage = false;
  }
}

export default toNative(GoodsOrderDetailPage);
</script>

<style lang="scss" scoped>
.order-detail-inner {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 2rem;

  &.capture-detail {
    display: none;
    opacity: 0.33;
  }
}
</style>
