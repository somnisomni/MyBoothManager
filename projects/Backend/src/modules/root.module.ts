import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { AppModuleV2 } from "./v2/app.v2.module";
import { RootController } from "./root.controller";

export const ROUTE_PREFIX = "v2" as const;

@Module({
  imports: [
    AppModuleV2,
    RouterModule.register([
      {
        path: ROUTE_PREFIX,
        module: AppModuleV2,
      },
    ]),
  ],
  controllers: [RootController],
})
export class RootModule { }
