import { Module } from "@nestjs/common";
import { AppModuleV2 } from "./v2/app.v2.module";
import { RouterModule } from "@nestjs/core";

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
})
export class RootModule { }
