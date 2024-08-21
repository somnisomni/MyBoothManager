import { Test, TestingModule } from "@nestjs/testing";
import { UtilModule } from "../util/util.module";
import { AdminAuthGuard } from "../auth/auth.guard";
import { GoodsCombinationController } from "./goods-combination.controller";
import { GoodsCombinationService } from "./goods-combination.service";

describe("GoodsCombinationController", () => {
  let controller: GoodsCombinationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UtilModule],
      controllers: [GoodsCombinationController],
      providers: [GoodsCombinationService],
    }).overrideGuard(AdminAuthGuard).useValue({ canActivate: () => true }).compile();

    controller = module.get<GoodsCombinationController>(GoodsCombinationController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
