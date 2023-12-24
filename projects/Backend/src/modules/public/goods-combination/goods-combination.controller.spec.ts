import { Test, TestingModule } from "@nestjs/testing";
import { PublicGoodsCombinationController } from "./goods-combination.controller";
import { PublicGoodsCombinationService } from "./goods-combination.service";

describe("GoodsCombinationController", () => {
  let controller: PublicGoodsCombinationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicGoodsCombinationController],
      providers: [PublicGoodsCombinationService],
    }).compile();

    controller = module.get<PublicGoodsCombinationController>(PublicGoodsCombinationController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
