import { Controller } from "@nestjs/common";
import { GoodsCombinationImageService } from "./goods-combination.image.service";

@Controller("/goods/combination/:id/image")
export class GoodsCombinationImageController {
  constructor(
    private readonly image: GoodsCombinationImageService,
  ) { }
}
