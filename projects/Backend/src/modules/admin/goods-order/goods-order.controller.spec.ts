import { Test, TestingModule } from "@nestjs/testing";
import { GoodsModule } from "../goods/goods.module";
import { GoodsCombinationModule } from "../goods-combination/goods-combination.module";
import { AdminAuthGuard } from "../auth/auth.guard";
import { GoodsOrderController } from "./goods-order.controller";
import { GoodsOrderService } from "./goods-order.service";

describe("GoodsOrderController", () => {
  let controller: GoodsOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GoodsModule, GoodsCombinationModule],
      controllers: [GoodsOrderController],
      providers: [GoodsOrderService],
    }).overrideGuard(AdminAuthGuard).useValue({ canActivate: () => true }).compile();

    controller = module.get<GoodsOrderController>(GoodsOrderController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
