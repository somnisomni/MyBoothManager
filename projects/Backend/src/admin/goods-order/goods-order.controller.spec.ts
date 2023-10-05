import { Test, TestingModule } from "@nestjs/testing";
import { GoodsOrderController } from "./goods-order.controller";
import { GoodsOrderService } from "./goods-order.service";

describe("GoodsOrderController", () => {
  let controller: GoodsOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoodsOrderController],
      providers: [GoodsOrderService],
    }).compile();

    controller = module.get<GoodsOrderController>(GoodsOrderController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
