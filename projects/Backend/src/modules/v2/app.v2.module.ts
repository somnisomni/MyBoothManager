import { Module } from "@nestjs/common";
import { AppControllerV2 } from "./app.v2.controller";

@Module({
  imports: [ ],
  controllers: [AppControllerV2],
})
export class AppModuleV2 { }
