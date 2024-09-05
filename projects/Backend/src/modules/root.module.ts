import { Module } from "@nestjs/common";
import { AppModuleV2 } from "./v2/app.v2.module";
import { RootController } from "./root.controller";

export const BOOTH_ID_QUERY = "bId" as const;

@Module({
  imports: [AppModuleV2],
  controllers: [RootController],
})
export class RootModule {
  public static readonly CURRENT_PREFIX = AppModuleV2.ROUTE_PREFIX;
}
