import { defineStore } from "pinia";
import { useAdminStore } from "./admin";
import { computed, type ComputedRef } from "vue";

const useAdminMemberStore = defineStore("booth-member", () => {
  /* *** Dependencies (NOT TO BE EXPORTED) *** */
  const $adminStore = useAdminStore();

  /* *** Computed States *** */
  /**
   * Normalized member map for goods.
   *
   * - Key: ID of booth member
   * - Value: Array of goods IDs that the member has
   */
  const goodsMemberMap: ComputedRef<Map<number, number[]>> = computed(() => {
    const map = new Map<number, number[]>();

    for(const member of Object.values($adminStore.currentBooth.boothMembers ?? { })) {
      map.set(member.id,
              Object.values($adminStore.currentBooth.goods ?? { }).filter(
                goods => goods.ownerMemberIds?.includes(member.id),
              ).map(goods => goods.id));
    }

    return map;
  });

  /**
   * Normalized member map for goods combinations.
   *
   * - Key: ID of booth member
   * - Value: Array of goods combination IDs that the member has
   */
  const goodsCombinationMemberMap: ComputedRef<Map<number, number[]>> = computed(() => {
    const map = new Map<number, number[]>();

    for(const member of Object.values($adminStore.currentBooth.boothMembers ?? { })) {
      map.set(member.id,
              Object.values($adminStore.currentBooth.goodsCombinations ?? { }).filter(
                combination => combination.ownerMemberIds?.includes(member.id),
              ).map(combination => combination.id));
    }

    return map;
  });

  return {
    goodsMemberMap,
    goodsCombinationMemberMap,
  };
});

export { useAdminMemberStore };
