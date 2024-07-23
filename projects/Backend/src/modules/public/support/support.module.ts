import { Module } from "@nestjs/common";
import { SupportController } from "./support.controller";
import { SupportService } from "./support.service";

@Module({
  controllers: [SupportController],
  providers: [SupportService],
})
export class SupportModule { }
