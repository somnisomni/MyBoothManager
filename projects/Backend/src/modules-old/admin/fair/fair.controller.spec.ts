import { Test, TestingModule } from "@nestjs/testing";
import { PublicFairModule } from "@/modules/public/fair/fair.module";
import { AdminAuthGuard } from "../auth/auth.guard";
import { FairController } from "./fair.controller";
import { FairService } from "./fair.service";

describe("FairController", () => {
  let controller: FairController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PublicFairModule],
      controllers: [FairController],
      providers: [FairService],
    }).overrideGuard(AdminAuthGuard).useValue({ canActivate: () => true }).compile();

    controller = module.get<FairController>(FairController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
