import type { GoodsAdmin, GoodsCombinationAdmin } from "@/lib/classes";
import { GoodsOrderPaymentMethod, GoodsOrderStatus } from "@myboothmanager/common";
import { defineStore } from "pinia";
import { computed, type ComputedRef } from "vue";
import { useAdminStore } from "./admin";
import { useAdminMemberStore } from "./member-utils";

type GoodsOrdersRecord = ReturnType<typeof useAdminStore>["currentBooth"]["orders"];

interface GoodsRevenueMapItem {
  id: number;            // ID of goods
  name: string;          // Name of goods
  quantity: number;      // Total quantity of goods across all orders
  totalRevenue: number;  // Total revenue of goods across all orders
  memberLength?: number; // Number of members who own this goods
}

const useAdminOrderStore = defineStore("booth-order", () => {
  /* *** Dependencies (NOT TO BE EXPORTED) *** */
  const $adminStore = useAdminStore();
  const $memberStore = useAdminMemberStore();

  /* *** Computed States *** */
  /**
   * Normalized orders that have at least one item in order item list.
   */
  const validOrders: ComputedRef<NonNullable<GoodsOrdersRecord>>
    = computed(() => Object.fromEntries(
      Object.entries($adminStore.currentBooth.orders ?? { })
        .filter(([ , value ]) => value.order.length > 0),
    ));

  /**
   * Count of valid orders(`validOrders`).
   */
  const validOrdersCount: ComputedRef<number>
    = computed(() => Object.keys(validOrders.value).length);

  /**
   * On top of `validOrders`, only includes orders that are in `RECORDED` status.
   */
  const validRecordedOrders: ComputedRef<NonNullable<GoodsOrdersRecord>>
    = computed(() => Object.fromEntries(
      Object.entries(validOrders.value)
        .filter(([ , value ]) => value.status === GoodsOrderStatus.RECORDED),
    ));

  /**
   * Count of valid recorded orders(`validRecordedOrders`).
   */
  const validRecordedOrdersCount: ComputedRef<number>
    = computed(() => Object.keys(validRecordedOrders.value).length);

  /**
   * Total count of sold stock of goods, based on `validRecordedOrders`.
   */
  const totalSoldStockCount: ComputedRef<number>
    = computed(() => Object.values(validRecordedOrders.value)
      .reduce((prev, cur) => prev + cur.order.reduce((orderPrev, orderCur) => {
        let quantity = orderCur.quantity;

        if(orderCur.cId) {
          quantity *= (orderCur.combinedGoods ?? [ ]).length;
        }

        return orderPrev + quantity;
      }, 0), 0));

  /**
   * Calculated and merged revenue of each goods, based on `validRecordedOrders`.
   *
   * Items in goods combinations are excluded from this calculation.
   *
   * - Key: ID of goods
   * - Value: Object containing the goods and revenue information
   */
  const goodsRevenueMap: ComputedRef<Map<number, GoodsRevenueMapItem>>
    = computed(() => {
      const map = new Map<number, GoodsRevenueMapItem>();

      for(const goods of Object.values(validRecordedOrders.value).flatMap(order => order.order)) {
        if(typeof goods.gId !== "number") {
          continue;
        }

        const originalGoods: GoodsAdmin | null = ($adminStore.currentBooth.goods ?? { })[goods.gId] ?? null;
        const originalPrice = originalGoods?.price ?? 0;

        // TODO: Below line is TEMPORARY; should revert to the commented line after DB reset
        const calculatedPrice = ((goods.price === undefined ? 0 : goods.price) ?? originalPrice) * goods.quantity;
        // const calculatedPrice = (goods.price ?? originalPrice) * goods.quantity;

        if(map.has(goods.gId)) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const item = map.get(goods.gId)!;

          // Merge(Update) the existing revenue information
          map.set(goods.gId, {
            ...item,
            quantity: item.quantity + goods.quantity,
            totalRevenue: item.totalRevenue + calculatedPrice,
          });
        } else {
          // Create a new revenue information
          map.set(goods.gId, {
            id: goods.gId,
            name: (originalGoods ?? goods).name ?? "(deleted)",
            quantity: goods.quantity,
            totalRevenue: calculatedPrice,
            memberLength: originalGoods?.ownerMemberIds?.length,
          });
        }
      }

      // Sort by name and reconstruct a new Map
      return new Map(
        Array.from(map.entries())
          .sort((a, b) => a[1].name.localeCompare(b[1].name)));
    });

  /**
   * Calculated and merged revenue of each goods combination, based on `validRecordedOrders`.
   *
   * - Key: ID of goods combination
   * - Value: Object containing the goods combination and revenue information
   */
  const combinationRevenueMap: ComputedRef<Map<number, GoodsRevenueMapItem>>
    = computed(() => {
      const map = new Map<number, GoodsRevenueMapItem>();

      for(const combination of Object.values(validRecordedOrders.value).flatMap(order => order.order)) {
        if(typeof combination.cId !== "number") {
          continue;
        }

        const originalCombination: GoodsCombinationAdmin = ($adminStore.currentBooth.goodsCombinations ?? { })[combination.cId] ?? null;
        const originalPrice = originalCombination?.price ?? 0;
        const calculatedPrice = (combination.price ?? originalPrice) * combination.quantity;

        if(map.has(combination.cId)) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const item = map.get(combination.cId)!;

          // Merge(Update) the existing revenue information
          map.set(combination.cId, {
            ...item,
            quantity: item.quantity + combination.quantity,
            totalRevenue: item.totalRevenue + calculatedPrice,
          });
        } else {
          // Create a new revenue information
          map.set(combination.cId, {
            id: combination.cId,
            name: (originalCombination ?? combination).name ?? "(deleted)",
            quantity: combination.quantity,
            totalRevenue: calculatedPrice,
            memberLength: originalCombination?.ownerMemberIds?.length,
          });
        }
      }

      // Sort by name and reconstruct a new Map
      return new Map(
        Array.from(map.entries())
          .sort((a, b) => a[1].name.localeCompare(b[1].name)));
    });

  /**
   * Calculated and merged revenue of each booth member, based on `goodsRevenueMap` and `combinationRevenueMap`.
   *
   * - Key: ID of booth member
   * - Value: Total revenue of the member
   */
  const memberRevenueMap: ComputedRef<Map<number, number>>
    = computed(() => {
      const map = new Map<number, number>();

      for(const member of Object.values($adminStore.currentBooth.boothMembers ?? { })) {
        const goodsList = $memberStore.goodsMemberMap.get(member.id);
        const combinationList = $memberStore.goodsCombinationMemberMap.get(member.id);

        if(!goodsList || !combinationList) {
          continue;
        }

        const goodsRevenue = goodsList.map((id) => {
          const rev = goodsRevenueMap.value.get(id);
          return rev ? rev.totalRevenue / (rev.memberLength ?? 1) : 0;
        }).reduce((prev, cur) => prev + cur, 0);

        const combinationRevenue = combinationList.map((id) => {
          const rev = combinationRevenueMap.value.get(id);
          return rev ? rev.totalRevenue / (rev.memberLength ?? 1) : 0;
        }).reduce((prev, cur) => prev + cur, 0);

        map.set(member.id, goodsRevenue + combinationRevenue);
      }

      // Sort by member ID and reconstruct a new Map
      return new Map(
        Array.from(map.entries())
          .sort((a, b) => a[0] - b[0]));
    });

  /**
   * Calculated and merged revenue of each payment type, based on `validRecordedOrders`.
   *
   * - Key: Payment method (enum `GoodsOrderPaymentMethod`)
   * - Value: Total revenue of the payment method
   */
  const paymentTypeRevenueMap: ComputedRef<Map<GoodsOrderPaymentMethod, number>>
    = computed(() => {
      const map = new Map<GoodsOrderPaymentMethod, number>();

      for(const order of Object.values(validRecordedOrders.value)) {
        if(!order.paymentMethod) {
          continue;
        }

        if(map.has(order.paymentMethod)) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const previous = map.get(order.paymentMethod)!;

          map.set(order.paymentMethod, previous + order.totalRevenue);
        } else {
          map.set(order.paymentMethod, order.totalRevenue);
        }
      }

      return map;
    });

  /**
   * Accumulated revenue of all valid recorded orders. (using `goodsRevenueMap` and `combinationRevenueMap`)
   */
  const totalMergedRevenue: ComputedRef<number>
    = computed(() =>
      Array.from(goodsRevenueMap.value.values()).reduce((prev, cur) => prev + cur.totalRevenue, 0)
      + Array.from(combinationRevenueMap.value.values()).reduce((prev, cur) => prev + cur.totalRevenue, 0));

  return {
    validOrders,
    validRecordedOrders,
    validOrdersCount,
    validRecordedOrdersCount,
    totalSoldStockCount,

    goodsRevenueMap,
    combinationRevenueMap,
    memberRevenueMap,
    paymentTypeRevenueMap,

    totalMergedRevenue,
  };
});

export { useAdminOrderStore };
