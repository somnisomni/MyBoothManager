import { Module } from "@nestjs/common";
import { PublicFairController } from "./fair.controller";
import { PublicFairService } from "./fair.service";

@Module({
  controllers: [PublicFairController],
  providers: [PublicFairService],
  exports: [PublicFairService],
})
export class PublicFairModule {}
