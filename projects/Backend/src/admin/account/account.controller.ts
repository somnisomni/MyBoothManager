import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from "@nestjs/common";
import { AccountService } from "./account.service";
import { CreateAccountDTO } from "./dto/create-account.dto";
import { UpdateAccountDTO } from "./dto/update-account.dto";
import { FastifyRequest } from "fastify";
import { IFastifyRequestParamsCustom, SuperAdmin } from "../auth/auth.guard";

@Controller("/admin/account")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  /* Normal routes */
  @Get()
  async findCurrent(@Req() req: FastifyRequest) {
    return await this.accountService.findCurrent((req.params as IFastifyRequestParamsCustom).authData);
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
