import { Test, TestingModule } from "@nestjs/testing";
import { PublicGoodsController } from "./goods.controller";
import { PublicGoodsService } from "./goods.service";

describe("GoodsController", () => {
  let controller: PublicGoodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicGoodsController],
      providers: [PublicGoodsService],
    }).compile();

    controller = module.get<PublicGoodsController>(PublicGoodsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
