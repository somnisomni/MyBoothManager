import Goods from "@/db/models/goods";
import { OmitInternals } from "@/lib/interface-omit";

export type GoodsOutput = OmitInternals<Goods>;
