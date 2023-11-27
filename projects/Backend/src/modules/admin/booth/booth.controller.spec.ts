import { Test, TestingModule } from "@nestjs/testing";
import { GoodsModule } from "../goods/goods.module";
import { GoodsOrderModule } from "../goods-order/goods-order.module";
import { GoodsCategoryModule } from "../goods-category/goods-category.module";
import { BoothController } from "./booth.controller";
import { BoothService } from "./booth.service";

describe("BoothController", () => {
  let controller: BoothController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GoodsModule, GoodsCategoryModule, GoodsOrderModule],
      controllers: [BoothController],
      providers: [BoothService],
    }).compile();

    controller = module.get<BoothController>(BoothController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
