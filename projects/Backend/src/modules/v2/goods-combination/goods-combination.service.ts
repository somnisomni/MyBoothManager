import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { BoothService } from "../booth/booth.service";
import { GoodsCombinationImageService } from "./goods-combination.image.service";

@Injectable()
export class GoodsCombinationService {
  constructor(
    @Inject(forwardRef(() => GoodsCombinationImageService))
    private readonly image: GoodsCombinationImageService,
    @Inject(forwardRef(() => BoothService))
    private readonly booth: BoothService,
  ) { }
}
