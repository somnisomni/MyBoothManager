import { UtilService } from "@/modules/common/util/util.service";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { GoodsService } from "./goods.service";

@Injectable()
export class GoodsImageService {
  constructor(
    @Inject(forwardRef(() => GoodsService))
    private readonly goods: GoodsService,
    private readonly util: UtilService,
  ) { }


}
