<template>
  <VMain>
    <VNavigationDrawer permanent class="navdrawer-flex">
      <VList nav class="flex-shrink-0">
        <VListItem prepend-icon="mdi-arrow-left" title="관리 페이지로 이동" :to="{ name: 'admin' }" />
        <VListItem class="text-center mt-2">
          <div class="appname text-grey-darken-2">{{ APP_NAME }}</div>
          <div class="text-h4 font-weight-medium">주문 목록</div>
        </VListItem>
      </VList>

      <VList class="overflow-auto flex-grow-1">
        <VSlideXReverseTransition group leave-absolute>
          <VListItem v-for="item in goodsInOrder"
                    :key="item.goodsId"
                    class="order-item pa-0"
                    height="72px">
            <VImg :src="'https://picsum.photos/seed/' + item.goodsId + '/200/250'" cover height="72px">
              <VLayout class="d-flex flex-row align-center px-2 py-1 w-100 h-100 text-background" style="background-color: rgba(0, 0, 0, 0.66)">
                <div class="d-flex flex-column flex-grow-1 flex-shrink-1" style="min-width: 0;">
                  <span class="font-weight-bold">{{ boothGoodsDict[item.goodsId].name }}</span>

                  <VSlideXReverseTransition :key="item.quantity">
                    <span>{{ item.quantity }}</span>
                  </VSlideXReverseTransition>
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
import { APP_NAME, type IGoods } from "@myboothmanager/common";
import { Component, Vue } from "vue-facing-decorator";
import { useAdminStore } from "@/stores/admin";
import GoodsItem from "@/components/goods/GoodsItem.vue";

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

  get boothGoods(): Array<IGoods> {
    return Object.values(useAdminStore().boothGoodsList);
  }

  get boothGoodsDict(): Record<number, IGoods> {
    return useAdminStore().boothGoodsList;
  }

  get currencySymbol(): string {
    return useAdminStore().boothList[useAdminStore().currentBoothId].currencySymbol;
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
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.125rem;
  line-height: 1.5rem;
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
