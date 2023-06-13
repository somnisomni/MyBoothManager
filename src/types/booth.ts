export enum BoothOpenStatus {
  __RESERVED = 0,
  OPEN,
  CLOSE,
}

export interface BoothData {
  id: number,
  name: string,
  openStatus: BoothOpenStatus;
  openStatusDesc?: string;
}
