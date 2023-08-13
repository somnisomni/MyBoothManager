import { defineStore } from "pinia";
import { type BoothData, type GoodsData, BoothOpenStatus } from "@/types/booth";

const useAdminStore = defineStore("admin", () => {
  const currentBoothId = 100000;
  const boothList: Record<number, BoothData> = {
    100000: {
      id: 100000,
      name: "Main Test Booth",
      currencySymbol: "₩",
      status: {
        status: BoothOpenStatus.OPEN,
      },
    },
    100001: {
      id: 100001,
      name: "Test booth #2",
      currencySymbol: "$",
      status: {
        status: BoothOpenStatus.PAUSE,
        reason: "Lunch time ;)",
      },
    },
    111111: {
      id: 111111,
      name: "Test booth #3",
      currencySymbol: "₩",
      status: {
        status: BoothOpenStatus.PAUSE,
        reason: "111111",
      },
    },
    222222: {
      id: 222222,
      name: "Test booth #4",
      currencySymbol: "$",
      status: {
        status: BoothOpenStatus.CLOSE,
      },
    },
    333333: {
      id: 333333,
      name: "Test booth #5",
      currencySymbol: "¥",
      status: {
        status: BoothOpenStatus.OPEN,
      },
    },
    444444: {
      id: 444444,
      name: "Test booth #6",
      currencySymbol: "¥",
      status: {
        status: BoothOpenStatus.PAUSE,
      },
    },
    555555: {
      id: 555555,
      name: "Test booth #7",
      currencySymbol: "¥",
      status: {
        status: BoothOpenStatus.CLOSE,
      },
    },
  };
  const goodsList: Record<number, GoodsData> = {
    1: {
      id: 1,
      boothId: 100000,
      name: "Test Goods #1 at Main Test Booth",
      price: 1000,
      stock: {
        initial: 100,
        current: 50,
      },
    },
    2: {
      id: 2,
      boothId: 100000,
      name: "Test Goods #2 at Main Test Booth",
      price: 15000,
      stock: {
        initial: 30,
        current: 20,
      },
    },
    3: {
      id: 3,
      boothId: 100000,
      name: "Momoi Acrylic Keyring at Main Test Booth",
      price: 8000,
      stock: {
        initial: 20,
        current: 15,
      },
    },
    4: {
      id: 4,
      boothId: 100001,
      name: "Awesome Goods at Test booth #2",
      price: 333333,
      stock: {
        initial: 5,
        current: 3,
      },
    },
  };

  return {
    currentBoothId,
    boothList,
    goodsList,
  };
});

export { useAdminStore };
