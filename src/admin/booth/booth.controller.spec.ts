import { Test, TestingModule } from "@nestjs/testing";
import { expectTypeOf } from "expect-type";
import { BoothController } from "./booth.controller";
import { BoothService } from "./booth.service";
import { Booth } from "./entities/booth.entity";

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

  it("should find all booths as an array filled with Booth objects", () => {
    const result = controller.findAll();

    expect(result).toBeDefined();
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Array);
    result.forEach((booth) => {
      expect(booth).toBeDefined();
      expect(booth).not.toBeNull();
      expectTypeOf(booth).toEqualTypeOf<Booth>();
    });
  });
});
