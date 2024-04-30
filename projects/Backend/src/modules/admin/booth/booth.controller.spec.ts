import { Test, TestingModule } from "@nestjs/testing";
import { PublicBoothModule } from "@/modules/public/booth/booth.module";
import { PublicBoothMemberModule } from "@/modules/public/booth-member/booth-member.module";
import { GoodsOrderModule } from "../goods-order/goods-order.module";
import { UtilModule } from "../util/util.module";
import { AdminAuthGuard } from "../auth/auth.guard";
import { BoothController } from "./booth.controller";
import { BoothService } from "./booth.service";

describe("BoothController", () => {
  let controller: BoothController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PublicBoothModule, PublicBoothMemberModule, GoodsOrderModule, UtilModule],
      controllers: [BoothController],
      providers: [BoothService],
    }).overrideGuard(AdminAuthGuard).useValue({ canActivate: () => true }).compile();

    controller = module.get<BoothController>(BoothController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
