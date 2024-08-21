import { Test, TestingModule } from "@nestjs/testing";
import { PublicGoodsModule } from "@/modules/public/goods/goods.module";
import { UtilModule } from "../util/util.module";
import { AdminAuthGuard } from "../auth/auth.guard";
import { GoodsController } from "./goods.controller";
import { GoodsService } from "./goods.service";

describe("GoodsController", () => {
  let controller: GoodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PublicGoodsModule, UtilModule],
      controllers: [GoodsController],
      providers: [GoodsService],
    }).overrideGuard(AdminAuthGuard).useValue({ canActivate: () => true }).compile();

    controller = module.get<GoodsController>(GoodsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
