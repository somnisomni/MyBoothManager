import { OmitInternals } from "@/lib/interface-omit";
import { IGoods } from "myboothmanager-common/interfaces";

export type GoodsOutput = OmitInternals<IGoods>;
