export enum BoothOpenStatus {
  __RESERVED = 0,
  OPEN,
  PAUSE,
  CLOSE,
}

export interface BoothData {
  id: number,
  name: string,
  status: {
    status: BoothOpenStatus,
    reason? :string,
  },
}
