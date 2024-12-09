import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { SUCCESS_RESPONSE } from "@myboothmanager/common";
import { RootController } from "./root.controller";
import { AppModuleV2 } from "./v2/app.v2.module";

describe("RootController", () => {
  let controller: RootController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModuleV2],
      controllers: [RootController],
    }).compile();

    controller = module.get<RootController>(RootController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("routeNotFound(): should throw NotFoundException", () => {
    try {
      controller.routeNotFound();

      fail("This should not be reached");
    } catch(e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e).toHaveProperty("message");
      expect(e).toHaveProperty("getStatus");

      if(e instanceof NotFoundException) {
        expect(e.getStatus()).toBe(404);
      }
    }
  });

  it("healthCheck(): should have success response", () => {
    const response = controller.healthCheck();
    expect(response).toEqual(SUCCESS_RESPONSE);
  });
});
