import { Module } from "@nestjs/common";
import { PublicFairModule } from "@/modules/public/fair/fair.module";
import { FairController } from "./fair.controller";
import { FairService } from "./fair.service";

@Module({
  imports: [PublicFairModule],
  controllers: [FairController],
  providers: [FairService],
  exports: [FairService],
})
export class FairModule {}
