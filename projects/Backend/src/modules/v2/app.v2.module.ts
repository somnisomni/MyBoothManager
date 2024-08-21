import { Module } from "@nestjs/common";
import { BoothModule } from "./booth/booth.module";
import { UtilModule } from "../common/util/util.module";

@Module({
  imports: [
    BoothModule,
    UtilModule,
  ],
})
export class AppModuleV2 { }
