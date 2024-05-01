import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { SUCCESS_RESPONSE } from "@myboothmanager/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should throw NotFoundException", () => {
    try {
      controller.notFound();
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

  it("should have success response", () => {
    const response = controller.healthCheck();
    expect(response).toEqual(SUCCESS_RESPONSE);
  });
});
