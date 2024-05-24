import { Test, TestingModule } from "@nestjs/testing";
import { PublicFairModule } from "@/modules/public/fair/fair.module";
import { FairController } from "./fair.controller";
import { FairService } from "./fair.service";

describe("AdminFairController", () => {
  let controller: FairController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PublicFairModule],
      controllers: [FairController],
      providers: [FairService],
    }).compile();

    controller = module.get<FairController>(FairController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
