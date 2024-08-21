import { Module } from "@nestjs/common";
import { AppModuleV2 } from "./v2/app.v2.module";
import { RouterModule } from "@nestjs/core";
import { RootController } from "./root.controller";

@Module({
  imports: [
    AppModuleV2,
    RouterModule.register([
      {
        path: "v2",
        module: AppModuleV2,
      },
    ]),
  ],
  controllers: [RootController],
})
export class RootModule { }
