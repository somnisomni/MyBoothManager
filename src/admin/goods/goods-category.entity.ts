import { IGoodsCategory } from "@/db/models/goods-category";
import { OmitInternals } from "@/lib/interface-omit";

export type GoodsCategoryOutput = OmitInternals<IGoodsCategory>;
