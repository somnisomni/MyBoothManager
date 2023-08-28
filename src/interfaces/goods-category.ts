export interface IGoodsCategory {
  id: number;
  boothId: number;  // Foreign key to Booth.id
  name: string;
}
export type IGoodsCategoryResponse = IGoodsCategory;

export type GoodsCategoryCreateRequestKey = "boothId" | "name";
export type IGoodsCategoryCreateRequest = Pick<IGoodsCategory, GoodsCategoryCreateRequestKey>;
