import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, ClassSerializerInterceptor } from "@nestjs/common";
import { AuthData, AdminAuthGuard, SuperAdmin } from "../auth/auth.guard";
import { IAuthPayload } from "../auth/jwt";
import { AccountService } from "./account.service";
import { CreateAccountDTO } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";
import { AccountResponseDto } from "./dto/account.dto";

@UseGuards(AdminAuthGuard)
@Controller("/admin/account")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  /* Normal routes */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findCurrent(@AuthData() authData: IAuthPayload): Promise<AccountResponseDto> {
    return new AccountResponseDto(await this.accountService.findCurrent(authData));
  }

  /* Super admin routes */
  @SuperAdmin()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createAccountDto: CreateAccountDTO): Promise<AccountResponseDto> {
    return new AccountResponseDto(await this.accountService.create(createAccountDto));
  }

  @SuperAdmin()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string): Promise<AccountResponseDto> {
    return new AccountResponseDto(await this.accountService.findOneById(+id));
  }

  @SuperAdmin()
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(+id, updateAccountDto);
  }

  @SuperAdmin()
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.accountService.remove(+id);
  }
}
