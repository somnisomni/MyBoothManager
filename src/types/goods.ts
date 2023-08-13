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
