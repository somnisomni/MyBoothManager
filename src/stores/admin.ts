import { defineStore } from "pinia";
import { type BoothData, BoothOpenStatus } from "@/types/booth";

export const useAdminStore = defineStore("admin", () => {
  const currentBoothId = 123456;
  const boothList: Record<number, BoothData> = {
    123456: {
      id: 123456,
      name: "Test Booth",
      status: {
        status: BoothOpenStatus.OPEN,
      },
    },
    712854: {
      id: 712854,
      name: "Test booth #2",
      status: {
        status: BoothOpenStatus.PAUSE,
        reason: "Lunch time ;)",
      },
    },
  };

  return {
    currentBoothId,
    boothList,
  };
});
