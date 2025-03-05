import { Module } from "@nestjs/common";
import AccountController from "./account.controller";
import AccountService from "./account.service";

@Module({
  providers: [ AccountService ],
  controllers: [ AccountController ],
  exports: [ AccountService ],
})
export default class AccountModule { }
