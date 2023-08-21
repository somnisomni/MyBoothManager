export interface GoodsStockData {
  initial: number;
  current: number;
}

export class GoodsCategory {
  id!: number;
  boothId!: number;
  name!: string;
}

export class Goods {
  id!: number;
  boothId!: number;
  categoryId: number | null = null;
  name!: string;
  price: number = 0;
  stock: GoodsStockData = { initial: 0, current: 0 };
}
