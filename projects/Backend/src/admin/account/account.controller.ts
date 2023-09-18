import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Res } from "@nestjs/common";
import { AccountService } from "./account.service";
import { CreateAccountDTO } from "./dto/create-account.dto";
import { UpdateAccountDTO } from "./dto/update-account.dto";
import { LoginDTO } from "./dto/login.dto";
import { FastifyReply } from "fastify";
import { IAccountLoginResponse } from "@myboothmanager/common";

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
  async login(@Body() loginDto: LoginDTO, @Res() response: FastifyReply) {
    let result: IAccountLoginResponse;

    if(loginDto.loginId === process.env.SUPERADMIN_ID
       && loginDto.loginPass === process.env.SUPERADMIN_PASS) {
      // SuperAdmin login
      result = await this.accountService.loginSA();
    } else {
      // Normal login
      result = await this.accountService.login(loginDto);
    }

    // response.setCookie("accessToken", result.token, { httpOnly: true });
    // response.setCookie("refreshToken", result.refreshToken, { httpOnly: true });

    response.send(result);
    return result;
  }
}
