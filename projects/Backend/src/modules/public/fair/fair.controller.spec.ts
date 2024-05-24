import { Test, TestingModule } from "@nestjs/testing";
import { PublicFairController } from "./fair.controller";
import { PublicFairService } from "./fair.service";

describe("FairController", () => {
  let controller: PublicFairController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicFairController],
      providers: [PublicFairService],
    }).compile();

    controller = module.get<PublicFairController>(PublicFairController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
