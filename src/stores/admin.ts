import { defineStore } from "pinia";
import { type BoothData, BoothOpenStatus } from "@/types/booth";
import { type GoodsCategoryData, type GoodsData } from "@/types/goods";
import { adminGET } from "@/lib/api";
import { reactive } from "vue";

const useAdminStore = defineStore("admin", () => {
  /* States */
  const currentBoothId = 100000;
  const boothList: Record<number, BoothData> = reactive({
    100000: {
      id: 100000,
      name: "Main Test Booth",
      description: "Awesome Booth Main",
      currencySymbol: "₩",
      status: {
        status: BoothOpenStatus.OPEN,
      },
    },
  });
  const goodsCategoryList: Record<number, GoodsCategoryData> = reactive({
    1: {
      id: 1,
      boothId: 100000,
      name: "블루아카이브",
    },
    2: {
      id: 2,
      boothId: 100000,
      name: "원신",
    },
    3: {
      id: 3,
      boothId: 100000,
      name: "기타",
    },
  });
  const goodsList: Record<number, GoodsData> = reactive({
    1: {
      id: 1,
      boothId: 100000,
      categoryId: 2,
      name: "나히다 포토카드",
      price: 1000,
      stock: {
        initial: 100,
        current: 50,
      },
    },
    2: {
      id: 2,
      boothId: 100000,
      categoryId: 1,
      name: "프라나 아크릴 스탠드",
      price: 15000,
      stock: {
        initial: 30,
        current: 20,
      },
    },
    3: {
      id: 3,
      boothId: 100000,
      categoryId: 1,
      name: "모모이 SD 아크릴 키링",
      price: 8000,
      stock: {
        initial: 20,
        current: 15,
      },
    },
    4: {
      id: 4,
      boothId: 100001,
      categoryId: 3,
      name: "Awesome Goods at Test booth #2",
      price: 333333,
      stock: {
        initial: 5,
        current: 3,
      },
    },
  });

  /* Actions */
  async function fetchAllBooths() {
    const response = (await (await adminGET("booth")).json()) as Array<BoothData>;

    for(const booth of response) {
      boothList[booth.id] = booth;
    }
    console.log(boothList);
  }

  return {
    currentBoothId,
    boothList,
    goodsCategoryList,
    goodsList,

    fetchAllBooths,
  };
});

export { useAdminStore };
