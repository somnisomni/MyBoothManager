import { Test, TestingModule } from "@nestjs/testing";
import { AdminAuthGuard } from "../auth/auth.guard";
import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";

describe("AccountController", () => {
  let controller: AccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [AccountService],
    }).overrideGuard(AdminAuthGuard).useValue({ canActivate: () => true }).compile();

    controller = module.get<AccountController>(AccountController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
