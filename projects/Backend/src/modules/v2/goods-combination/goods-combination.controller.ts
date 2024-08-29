import { Controller } from "@nestjs/common";
import { GoodsCombinationService } from "./goods-combination.service";

@Controller("/goods/combination")
export class GoodsCombinationController {
  constructor(
    private readonly combination: GoodsCombinationService,
  ) { }
}
