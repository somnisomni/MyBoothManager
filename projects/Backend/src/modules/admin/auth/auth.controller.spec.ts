import { Test, TestingModule } from "@nestjs/testing";
import { JwtModule } from "@nestjs/jwt";
import { AccountModule } from "../account/account.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AdminAuthGuard } from "./auth.guard";

describe("AuthController", () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AccountModule,
        JwtModule,
      ],
      controllers: [AuthController],
      providers: [AuthService],
    }).overrideGuard(AdminAuthGuard).useValue({ canActivate: () => true }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
