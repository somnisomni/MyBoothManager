export enum BoothOpenStatus {
  __RESERVED = 0,
  OPEN,
  PAUSE,
  CLOSE,
  PREPARE,
}

export namespace BoothOpenStatus {
  export function getBoothOpenStatusString(status: BoothOpenStatus): string {
    switch(status) {
      case BoothOpenStatus.OPEN: return "운영 중";
      case BoothOpenStatus.PAUSE: return "일시 중지";
      case BoothOpenStatus.CLOSE: return "운영 종료";
      case BoothOpenStatus.PREPARE: return "운영 준비";
      default: return "알 수 없음";
    }
  }
}

export interface BoothStatusData {
  status: BoothOpenStatus,
  reason?: string,           // Reason of pausing status
  contentPublish?: boolean,  // Whether the content of the booth is publicily available while preparing status
}

export interface BoothData {
  id: number,
  name: string,
  currencySymbol: string,
  status: BoothStatusData,
}

export interface GoodsData {
  id: number,
  boothId: number,
  name: string,
  price: number,
  stock: {
    initial: number,
    current: number,
  },
}
