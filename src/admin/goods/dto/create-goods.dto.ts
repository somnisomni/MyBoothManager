export class CreateGoodsDTO {
  boothId!: number;
  categoryId: number | null = null;
  name!: string;
  price: number = 0;
  stockInitial: number = 0;
  stockCurrent: number = 0;
}
