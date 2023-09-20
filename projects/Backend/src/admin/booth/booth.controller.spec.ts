import { Test, TestingModule } from "@nestjs/testing";
import { BoothController } from "./booth.controller";
import { BoothService } from "./booth.service";
import { GoodsModule } from "../goods/goods.module";

describe("BoothController", () => {
  let controller: BoothController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GoodsModule],
      controllers: [BoothController],
      providers: [BoothService],
    }).compile();

    controller = module.get<BoothController>(BoothController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
