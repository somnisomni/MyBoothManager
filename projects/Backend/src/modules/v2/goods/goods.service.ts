import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { GoodsImageService } from "./goods.image.service";

@Injectable()
export class GoodsService {
  constructor(
    @Inject(forwardRef(() => GoodsImageService))
    private readonly image: GoodsImageService,
  ) { }


}
