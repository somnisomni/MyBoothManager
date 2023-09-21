import { IGoodsCreateRequest } from "@myboothmanager/common";

export class CreateGoodsDTO implements IGoodsCreateRequest {
  boothId!: number;
  categoryId?: number;
  name!: string;
  description?: string;
  type?: string;
  price!: number;
  stockInitial!: number;
  stockRemaining: number = -1;
}
