import { defineStore } from "pinia";
import { type GoodsCategoryData, type GoodsData } from "@/types/goods";
import AdminAPI from "@/lib/api-admin";
import { reactive } from "vue";
import { BoothStatus, type IBooth } from "myboothmanager-common/interfaces";

const useAdminStore = defineStore("admin", () => {
  /* States */
  const currentBoothId = 1;
  const boothList: Record<number, IBooth> = reactive({
    1: {
      id: 1,
      ownerId: 1,
      name: "Main Test Booth",
      description: "Awesome Booth Main",
      location: "테스트",
      currencySymbol: "₩",
      status: BoothStatus.OPEN,
    },
  });
  const goodsCategoryList: Record<number, GoodsCategoryData> = reactive({
    1: {
      id: 1,
      boothId: 1,
      name: "블루아카이브",
    },
    2: {
      id: 2,
      boothId: 1,
      name: "원신",
    },
    3: {
      id: 3,
      boothId: 1,
      name: "기타",
    },
  });
  const goodsList: Record<number, GoodsData> = reactive({
    1: {
      id: 1,
      boothId: 1,
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
      boothId: 1,
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
      boothId: 1,
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
    const response = await AdminAPI.fetchAllBooths();

    if(response) {
      for(const booth of response) {
        boothList[booth.id] = booth;
      }
    }
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
