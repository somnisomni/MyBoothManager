import { Module } from "@nestjs/common";
import { AppModuleV2 } from "./v2/app.v2.module";
import { RootController } from "./root.controller";

@Module({
  imports: [AppModuleV2],
  controllers: [RootController],
})
export class RootModule { }
