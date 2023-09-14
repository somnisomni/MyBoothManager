import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from "@nestjs/common";
import { AccountService } from "./account.service";
import { CreateAccountDTO } from "./dto/create-account.dto";
import { UpdateAccountDTO } from "./dto/update-account.dto";
import { LoginDTO } from "./dto/login.dto";

@Controller("/admin/account")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDTO) {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  findAll() {
    return this.accountService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.accountService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAccountDto: UpdateAccountDTO) {
    return this.accountService.update(+id, updateAccountDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.accountService.remove(+id);
  }

  @Post("login")
  @HttpCode(200)
  async login(@Body() loginDto: LoginDTO) {
    // SuperAdmin login
    if(loginDto.loginId === process.env.SUPERADMIN_ID
       && loginDto.loginPass === process.env.SUPERADMIN_PASS) {
      return await this.accountService.loginSA();
    }

    // Normal login
    return await this.accountService.login(loginDto);
  }
}
