import { IDataModelBase } from "./base";

export interface IGoodsSaleHistory extends IDataModelBase {
  id: number;
  goodsId: number;  // Foreign key to Goods.id
  price: number;
  stockChanges: number;
  timestamp: Date;
}
export type IGoodsSaleHistoryResponse = IGoodsSaleHistory;

export type GoodsSaleHistoryCreateRequestKey = "goodsId" | "price" | "stockChanges" | "timestamp";
export type IGoodsSaleHistoryCreateRequest = Pick<IGoodsSaleHistory, GoodsSaleHistoryCreateRequestKey>;
