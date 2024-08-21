import { Module } from "@nestjs/common";
import { PublicBoothMemberService } from "./booth-member.service";
import { PublicBoothMemberController } from "./booth-member.controller";

@Module({
  controllers: [PublicBoothMemberController],
  providers: [PublicBoothMemberService],
  exports: [PublicBoothMemberService],
})
export class PublicBoothMemberModule { }
