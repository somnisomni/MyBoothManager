import { Test, TestingModule } from "@nestjs/testing";
import { GoodsModule } from "../goods/goods.module";
import { GoodsOrderController } from "./goods-order.controller";
import { GoodsOrderService } from "./goods-order.service";

describe("GoodsOrderController", () => {
  let controller: GoodsOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GoodsModule],
      controllers: [GoodsOrderController],
      providers: [GoodsOrderService],
    }).compile();

    controller = module.get<GoodsOrderController>(GoodsOrderController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});