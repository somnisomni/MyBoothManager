import { Module } from "@nestjs/common";
import { UtilModule } from "../../common/util/util.module";
import BoothModule from "../booth/booth.module";
import { BoothMemberController } from "./booth-member.controller";
import { BoothMemberImageController } from "./booth-member.image.controller";
import { BoothMemberImageService } from "./booth-member.image.service";
import { BoothMemberService } from "./booth-member.service";

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
