import { IBooth } from "@/db/models/booth";
import { OmitInternals } from "@/lib/interface-omit";

export type BoothOutput = OmitInternals<IBooth>;
