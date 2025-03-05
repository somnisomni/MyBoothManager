import { Module } from "@nestjs/common";
import { RootController } from "./root.controller";
import { AppModuleV2 } from "./v2/app.v2.module";

@Module({
  imports: [ AppModuleV2 ],
  controllers: [ RootController ],
})
export class RootModule { }
