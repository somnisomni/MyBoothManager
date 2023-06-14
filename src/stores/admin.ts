import { defineStore } from "pinia";
import { type BoothData, BoothOpenStatus } from "@/types/booth";

export const useAdminStore = defineStore("admin", () => {
  const currentBoothId = 123456;
  const boothList: Record<number, BoothData> = {
    123456: {
      id: 123456,
      name: "Test Booth",
      openStatus: BoothOpenStatus.OPEN,
    },
    712854: {
      id: 712854,
      name: "Test booth #2",
      openStatus: BoothOpenStatus.PAUSE,
      pauseReason: "Lunch time ;)",
    },
  };

  return {
    currentBoothId,
    boothList,
  };
});
