export enum BoothStatus {
  OPEN = "open",
  PAUSE = "pause",
  CLOSE = "close",
  PREPARE = "prepare",

  "open" = OPEN,
  "pause" = PAUSE,
  "close" = CLOSE,
  "prepare" = PREPARE,
}

export interface BoothStatusData {
  status: BoothStatus;
  reason?: string;
  publishContent?: boolean;
}

export class Booth {
  id!: number;
  name!: string;
  description: string | null = null;
  currencySymbol!: string;
  status: BoothStatusData = { status: BoothStatus.PREPARE };
}
