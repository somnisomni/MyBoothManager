import { Module } from "@nestjs/common";
import { UtilModule } from "@/modules/common/util/util.module";
import { BoothController } from "./booth.controller";
import { BoothService } from "./booth.service";
import { BoothImageService } from "./booth.image.service";
import { BoothImageController } from "./booth.image.controller";

@Module({
  imports: [UtilModule],
  providers: [
    BoothService,
    BoothImageService,
  ],
  controllers: [
    BoothController,
    BoothImageController,
  ],
  exports: [
    BoothService,
    // BoothImageService,
  ],
})
export default class BoothModule { }
