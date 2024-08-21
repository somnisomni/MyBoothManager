import { Test, TestingModule } from "@nestjs/testing";
import { PublicGoodsCategoryController } from "./goods-category.controller";
import { PublicGoodsCategoryService } from "./goods-category.service";

describe("GoodsCategoryController", () => {
  let controller: PublicGoodsCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicGoodsCategoryController],
      providers: [PublicGoodsCategoryService],
    }).compile();

    controller = module.get<PublicGoodsCategoryController>(PublicGoodsCategoryController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
