import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { SUCCESS_RESPONSE } from "@myboothmanager/common";
import { AppControllerV2 } from "./app.v2.controller";

describe("AppControllerV2", () => {
  let controller: AppControllerV2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppControllerV2],
    }).compile();

    controller = module.get<AppControllerV2>(AppControllerV2);
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
