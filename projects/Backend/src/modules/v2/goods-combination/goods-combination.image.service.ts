import { UtilService } from "@/modules/common/util/util.service";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { GoodsCombinationService } from "./goods-combination.service";

@Injectable()
export class GoodsCombinationImageService {
  constructor(
    @Inject(forwardRef(() => GoodsCombinationService))
    private readonly combination: GoodsCombinationService,
    private readonly util: UtilService,
  ) { }
}
