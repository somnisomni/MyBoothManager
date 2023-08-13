export enum BoothOpenStatus {
  __RESERVED = 0,
  OPEN,
  PAUSE,
  CLOSE,
}

export interface BoothData {
  id: number,
  name: string,
  currencySymbol: string,
  status: {
    status: BoothOpenStatus,
    reason? :string,
  },
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
