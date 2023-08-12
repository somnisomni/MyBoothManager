import { defineStore } from "pinia";
import { type BoothData, BoothOpenStatus } from "@/types/booth";

const useAdminStore = defineStore("admin", () => {
  const currentBoothId = 100000;
  const boothList: Record<number, BoothData> = {
    100000: {
      id: 100000,
      name: "Main Test Booth",
      status: {
        status: BoothOpenStatus.OPEN,
      },
    },
    100001: {
      id: 100001,
      name: "Test booth #2",
      status: {
        status: BoothOpenStatus.PAUSE,
        reason: "Lunch time ;)",
      },
    },
    111111: {
      id: 111111,
      name: "Test booth #3",
      status: {
        status: BoothOpenStatus.PAUSE,
        reason: "111111",
      },
    },
    222222: {
      id: 222222,
      name: "Test booth #4",
      status: {
        status: BoothOpenStatus.CLOSE,
      },
    },
    333333: {
      id: 333333,
      name: "Test booth #5",
      status: {
        status: BoothOpenStatus.OPEN,
      },
    },
    444444: {
      id: 444444,
      name: "Test booth #6",
      status: {
        status: BoothOpenStatus.PAUSE,
      },
    },
    555555: {
      id: 555555,
      name: "Test booth #7",
      status: {
        status: BoothOpenStatus.CLOSE,
      },
    },
  };

  return {
    currentBoothId,
    boothList,
  };
});

export { useAdminStore };
