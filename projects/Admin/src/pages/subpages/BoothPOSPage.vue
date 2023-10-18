<template>
  <VMain>
    <VNavigationDrawer permanent class="navdrawer-flex">
      <VList nav class="flex-shrink-0">
        <VListItem prepend-icon="mdi-arrow-left" title="관리 페이지로 이동" :to="{ name: 'admin' }" />
        <VListItem class="text-center">
          <div class="appname text-grey">{{ APP_NAME }}</div>
          <div class="boothname text-darken-2">{{ boothName }}</div>
          <div class="mt-1 text-h4 font-weight-bold">주문 목록</div>
        </VListItem>
      </VList>

      <VList class="overflow-auto overflow-x-hidden flex-grow-1">
        <VSlideXReverseTransition group leave-absolute>
          <VListItem v-for="item in goodsInOrder"
                     :key="item.goodsId"
                     class="order-item pa-0"
                     height="72px">
            <VImg :src="'https://picsum.photos/seed/' + item.goodsId + '/200/250'" cover height="72px">
              <VLayout class="d-flex flex-row align-center px-2 py-1 w-100 h-100 text-background" style="background-color: rgba(0, 0, 0, 0.66)">
                <div class="d-flex flex-column flex-grow-1 flex-shrink-1" style="min-width: 0;">
                  <span class="text-body-1 font-weight-bold">{{ boothGoodsDict[item.goodsId].name }}</span>
                  <span class="text-body-2">{{ item.quantity }}개 · {{ calculateGoodsPrice(item.goodsId, item.quantity) }}</span>
                </div>

                <div>
                  <VBtn icon="mdi-plus" variant="text" size="small" @click.stop="updateGoodsInOrderQuantity(item.goodsId, 1)" />
                  <VBtn icon="mdi-minus" variant="text" size="small" @click.stop="updateGoodsInOrderQuantity(item.goodsId, -1)" />
                </div>
              </VLayout>
            </VImg>
          </VListItem>
        </VSlideXReverseTransition>
      </VList>

      <VList nav class="flex-shrink-0 pa-0 pb-2">
        <VListItem class="px-2 py-1">
          <div class="text-body-2 text-center mb-2">총 가격: <strong>{{ totalOrderWorthString }}</strong></div>
          <VBtn prepend-icon="mdi-cart-heart" color="primary" size="x-large" class="w-100">판매 확인</VBtn>
        </VListItem>
      </VList>
    </VNavigationDrawer>

    <VContainer class="d-flex flex-row flex-wrap">
      <GoodsItem v-for="goods in boothGoods"
                 :key="goods.id"
                 :goodsData="goods"
                 :currencySymbol="currencySymbol"
                 :editMode="false"
                 @click="onGoodsItemClick" />
    </VContainer>
  </VMain>
</template>

<script lang="ts">
import { APP_NAME, BoothStatus, type IBooth, type IGoods } from "@myboothmanager/common";
import { Component, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import GoodsItem from "@/components/goods/GoodsItem.vue";
import router from "@/router";

interface IGoodsOrder {
  goodsId: number;
  quantity: number;
}

@Component({
  components: {
    GoodsItem,
  },
})
export default class BoothPOSPage extends Vue {
  readonly APP_NAME = APP_NAME;
  readonly goodsInOrder: Record<number, IGoodsOrder> = {};

  get currentBooth(): IBooth {
    return useAdminStore().boothList[useAdminStore().currentBoothId];
  }

  get boothName(): string {
    return this.currentBooth.name;
  }

  get currencySymbol(): string {
    return this.currentBooth.currencySymbol;
  }

  get boothGoods(): Array<IGoods> {
    return Object.values(useAdminStore().boothGoodsList);
  }

  get boothGoodsDict(): Record<number, IGoods> {
    return useAdminStore().boothGoodsList;
  }

  get totalOrderWorthString(): string {
    let total = 0;

    for(const goodsId in this.goodsInOrder) {
      total += this.boothGoodsDict[goodsId].price * this.goodsInOrder[goodsId].quantity;
    }

    return `${this.currencySymbol}${total.toLocaleString()}`;
  }

  mounted(): void {
    if(this.currentBooth.status !== BoothStatus.OPEN) {
      router.replace({ name: "admin" });
    }
  }

  calculateGoodsPrice(goodsId: number, quantity: number): string {
    return `${this.currencySymbol}${(this.boothGoodsDict[goodsId].price * quantity).toLocaleString()}`;
  }

  onGoodsItemClick(goodsId: number) {
    if(this.goodsInOrder[goodsId]) {
      this.goodsInOrder[goodsId].quantity++;
    } else {
      this.goodsInOrder[goodsId] = {
        goodsId,
        quantity: 1,
      };
    }
  }

  updateGoodsInOrderQuantity(goodsId: number, delta: number) {
    if(this.goodsInOrder[goodsId]) {
      this.goodsInOrder[goodsId].quantity += delta;

      if(this.goodsInOrder[goodsId].quantity <= 0) {
        delete this.goodsInOrder[goodsId];
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.appname {
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.125rem;
  line-height: 1.33;
}

.boothname {
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.125rem;
  line-height: 1.33;
}

.order-item {
  & * {
    white-space: nowrap;

    & span {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
