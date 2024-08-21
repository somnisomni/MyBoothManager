import { Module } from "@nestjs/common";
import { PublicBoothMemberModule } from "@/modules/public/booth-member/booth-member.module";
import { UtilModule } from "../util/util.module";
import { BoothMemberController } from "./booth-member.controller";
import { BoothMemberService } from "./booth-member.service";

@Module({
  imports: [
    PublicBoothMemberModule,
    UtilModule,
  ],
  controllers: [
    BoothMemberController,
  ],
  providers: [
    BoothMemberService,
  ],
  exports: [
    BoothMemberService,
  ],
})
export class BoothMemberModule {}
