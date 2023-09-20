import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { AccountService } from "./account.service";
import { CreateAccountDTO } from "./dto/create-account.dto";
import { UpdateAccountDTO } from "./dto/update-account.dto";
import { AuthData, SuperAdmin } from "../auth/auth.guard";
import { IAuthPayload } from "../auth/jwt";

@Controller("/admin/account")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  /* Normal routes */
  @Get()
  async findCurrent(@AuthData() authData: IAuthPayload) {
    return await this.accountService.findCurrent(authData);
  }

  /* Super admin routes */
  @SuperAdmin()
  @Post()
  create(@Body() createAccountDto: CreateAccountDTO) {
    return this.accountService.create(createAccountDto);
  }

  @SuperAdmin()
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.accountService.findOneById(+id);
  }

  @SuperAdmin()
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAccountDto: UpdateAccountDTO) {
    return this.accountService.update(+id, updateAccountDto);
  }

  @SuperAdmin()
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.accountService.remove(+id);
  }
}
