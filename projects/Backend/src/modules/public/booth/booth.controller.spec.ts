import { Test, TestingModule } from "@nestjs/testing";
import { PublicGoodsModule } from "../goods/goods.module";
import { PublicGoodsCategoryModule } from "../goods-category/goods-category.module";
import { PublicGoodsCombinationModule } from "../goods-combination/goods-combination.module";
import { PublicBoothController } from "./booth.controller";
import { PublicBoothService } from "./booth.service";

describe("BoothController", () => {
  let controller: PublicBoothController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PublicGoodsModule, PublicGoodsCategoryModule, PublicGoodsCombinationModule],
      controllers: [PublicBoothController],
      providers: [PublicBoothService],
    }).compile();

    controller = module.get<PublicBoothController>(PublicBoothController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
