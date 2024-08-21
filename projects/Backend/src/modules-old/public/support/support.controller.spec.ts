import { Test, TestingModule } from "@nestjs/testing";
import { SupportController } from "./support.controller";
import { SupportService } from "./support.service";

describe("SupportController", () => {
  let controller: SupportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupportController],
      providers: [SupportService],
    }).compile();

    controller = module.get<SupportController>(SupportController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
