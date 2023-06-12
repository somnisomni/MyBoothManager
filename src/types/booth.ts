export enum BoothOpenStatus {
  __RESERVED = 0,
  OPEN,
  CLOSE,
}

export interface BoothData {
  openStatus: BoothOpenStatus;
  openStatusDesc?: string;
}
