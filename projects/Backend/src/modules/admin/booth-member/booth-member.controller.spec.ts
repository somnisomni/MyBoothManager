import { Test, TestingModule } from "@nestjs/testing";
import { PublicBoothMemberModule } from "@/modules/public/booth-member/booth-member.module";
import { UtilModule } from "../util/util.module";
import { AdminAuthGuard } from "../auth/auth.guard";
import { BoothMemberController } from "./booth-member.controller";
import { BoothMemberService } from "./booth-member.service";

describe("BoothMemberController", () => {
  let controller: BoothMemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PublicBoothMemberModule, UtilModule],
      controllers: [BoothMemberController],
      providers: [BoothMemberService],
    }).overrideGuard(AdminAuthGuard).useValue({ canActivate: () => true }).compile();

    controller = module.get<BoothMemberController>(BoothMemberController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
