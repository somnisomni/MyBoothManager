import { Controller } from "@nestjs/common";
import { GoodsService } from "./goods.service";

@Controller("/goods")
export class GoodsController {
  constructor(
    private readonly goods: GoodsService,
  ) { }
}
