import { Test, TestingModule } from "@nestjs/testing";
import { PublicGoodsCategoryModule } from "@/modules/public/goods-category/goods-category.module";
import { AdminAuthGuard } from "../auth/auth.guard";
import { GoodsCategoryController } from "./goods-category.controller";
import { GoodsCategoryService } from "./goods-category.service";

describe("GoodsCategoryController", () => {
  let controller: GoodsCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PublicGoodsCategoryModule],
      controllers: [GoodsCategoryController],
      providers: [GoodsCategoryService],
    }).overrideGuard(AdminAuthGuard).useValue({ canActivate: () => true }).compile();

    controller = module.get<GoodsCategoryController>(GoodsCategoryController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
