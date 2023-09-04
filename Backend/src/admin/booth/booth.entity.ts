import { OmitInternals } from "@/lib/interface-omit";
import { IBooth } from "myboothmanager-common/interfaces";

export type BoothOutput = OmitInternals<IBooth>;
