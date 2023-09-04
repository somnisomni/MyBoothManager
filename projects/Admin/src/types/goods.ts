export interface GoodsCategoryData {
  id: number,
  boothId: number,
  name: string,
}

export interface GoodsData {
  id: number,
  boothId: number,
  categoryId: number,
  name: string,
  price: number,
  stock: {
    initial: number,
    current: number,
  },
}
