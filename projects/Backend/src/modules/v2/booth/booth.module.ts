import { Module } from "@nestjs/common";
import { UtilModule } from "@/modules/common/util/util.module";
import { BoothController } from "./booth.controller";
import { BoothService } from "./booth.service";
import { BoothImageService } from "./booth.image.service";

@Module({
  imports: [UtilModule],
  controllers: [BoothController],
  providers: [
    BoothService,
    BoothImageService,
  ],
})
export class BoothModule { }
