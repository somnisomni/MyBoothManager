import { Test, TestingModule } from "@nestjs/testing";
import { PublicGoodsModule } from "@/modules/public/goods/goods.module";
import { GoodsController } from "./goods.controller";
import { GoodsService } from "./goods.service";

describe("GoodsController", () => {
  let controller: GoodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PublicGoodsModule],
      controllers: [GoodsController],
      providers: [GoodsService],
    }).compile();

    controller = module.get<GoodsController>(GoodsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
