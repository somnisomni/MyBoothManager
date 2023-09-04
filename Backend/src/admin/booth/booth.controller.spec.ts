import { Test, TestingModule } from "@nestjs/testing";
import { BoothController } from "./booth.controller";
import { BoothService } from "./booth.service";

describe("BoothController", () => {
  let controller: BoothController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoothController],
      providers: [BoothService],
    }).compile();

    controller = module.get<BoothController>(BoothController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
