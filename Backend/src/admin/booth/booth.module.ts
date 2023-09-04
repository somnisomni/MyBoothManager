import { Module } from "@nestjs/common";
import { BoothService } from "./booth.service";
import { BoothController } from "./booth.controller";

@Module({
  controllers: [BoothController],
  providers: [BoothService],
})
export class BoothModule {}
