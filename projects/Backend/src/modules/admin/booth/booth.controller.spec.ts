import { Test, TestingModule } from "@nestjs/testing";
import { PublicBoothModule } from "@/modules/public/booth/booth.module";
import { GoodsOrderModule } from "../goods-order/goods-order.module";
import { BoothController } from "./booth.controller";
import { BoothService } from "./booth.service";

describe("BoothController", () => {
  let controller: BoothController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PublicBoothModule, GoodsOrderModule],
      controllers: [BoothController],
      providers: [BoothService],
    }).compile();

    controller = module.get<BoothController>(BoothController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
