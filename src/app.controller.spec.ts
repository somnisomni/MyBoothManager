import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { NotFoundException } from "@nestjs/common";

describe("AppController", () => {
  let testingModule: TestingModule;
  let appController: AppController;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = testingModule.get<AppController>(AppController);
  });
  afterEach(async () => { await testingModule.close(); });

  it("should be defined", () => {
    expect(appController).toBeDefined();
  });

  it("should throw NotFoundException", () => {
    expect(appController.notFound).toThrowError(NotFoundException);
  });
});
