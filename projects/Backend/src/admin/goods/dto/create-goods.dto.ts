import { IGoodsCreateRequest } from "myboothmanager-common/interfaces";

export class CreateGoodsDTO implements IGoodsCreateRequest {
  boothId!: number;
  categoryId?: number;
  name!: string;
  description?: string;
  price!: number;
  stockInitial!: number;
  stockRemaining: number = -1;
}
