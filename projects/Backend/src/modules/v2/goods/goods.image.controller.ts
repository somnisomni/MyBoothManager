import { Controller } from "@nestjs/common";
import { GoodsImageService } from "./goods.image.service";
import { UtilService } from "@/modules/common/util/util.service";

@Controller("/goods/:id/image")
export class GoodsImageController {
  constructor(
    private readonly image: GoodsImageService,
    private readonly util: UtilService,
  ) { }
}
