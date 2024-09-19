import { Module } from "@nestjs/common";
import AccountService from "./account.service";
import AccountController from "./account.controller";

@Module({
  providers: [AccountService],
  controllers: [AccountController],
  exports: [AccountService],
})
export default class AccountModule { }
