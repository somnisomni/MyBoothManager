import { Module } from "@nestjs/common";
import { FairController } from "./fair.controller";
import { FairService } from "./fair.service";

@Module({
  providers: [FairService],
  controllers: [FairController],
  exports: [FairService],
})
export default class FairModule { }
