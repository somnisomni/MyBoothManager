import { Module } from "@nestjs/common";
import { BoothMemberController } from "./booth-member.controller";
import { BoothMemberService } from "./booth-member.service";
import { BoothMemberImageService } from "./booth-member.image.service";
import { BoothMemberImageController } from "./booth-member.image.controller";
import BoothModule from "../booth/booth.module";
import { UtilModule } from "../../common/util/util.module";

@Module({
  imports: [
    BoothModule,
    UtilModule,
  ],
  controllers: [
    BoothMemberController,
    BoothMemberImageController,
  ],
  providers: [
    BoothMemberService,
    BoothMemberImageService,
  ],
  exports: [
    BoothMemberService,
  ],
})
export default class BoothMemberModule { }
