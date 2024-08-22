import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { BoothModule } from "./booth/booth.module";
import { UtilModule } from "../common/util/util.module";
import { AuthGuard } from "./auth/auth.guard";

@Module({
  imports: [
    BoothModule,
    UtilModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModuleV2 { }
