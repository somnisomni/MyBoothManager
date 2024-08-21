import { Test, TestingModule } from "@nestjs/testing";
import { PublicBoothMemberController } from "./booth-member.controller";
import { PublicBoothMemberService } from "./booth-member.service";

describe("BoothMemberController", () => {
  let controller: PublicBoothMemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicBoothMemberController],
      providers: [PublicBoothMemberService],
    }).compile();

    controller = module.get<PublicBoothMemberController>(PublicBoothMemberController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
