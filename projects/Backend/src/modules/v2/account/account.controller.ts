import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch } from "@nestjs/common";
import AccountService from "./account.service";
import { AllowedFor, AuthData, UserTypes } from "../auth/auth.guard";
import { IAuthData } from "../auth/jwt-util.service";
import { AccountResponseDto } from "./dto/account.dto";
import { UpdateAccountDto } from "./dto/update.dto";
import { UpdateAccountPasswordDto } from "./dto/update-password.dto";
import { ISuccessResponse } from "@myboothmanager/common";

@Controller("account")
export default class AccountController {
  constructor(
    private readonly account: AccountService,
  ) { }

  /* === Booth admin routes === */
  /**
   * Update 'current' (according to the auth data) account information
   */
  @Patch()
  @AllowedFor(UserTypes.BOOTH_ADMIN)
  async updateCurrent(
    @Body() updateDto: UpdateAccountDto,
    @AuthData() authData: IAuthData): Promise<AccountResponseDto> {
    return new AccountResponseDto(await this.account.update(authData.id, updateDto));
  }

  /**
   * Update 'current' (according to the auth data) account's password
   */
  @Patch("password")
  @AllowedFor(UserTypes.BOOTH_ADMIN)
  async updateCurrentPassword(
    @Body() updatePasswordDto: UpdateAccountPasswordDto,
    @AuthData() authData: IAuthData): Promise<ISuccessResponse> {
    return await this.account.updatePassword(authData.id, updatePasswordDto);
  }

  /* === Admin routes === */
  /**
   * Find 'current' (according to the auth data) account information
   */
  @Get()
  @AllowedFor(UserTypes.BOOTH_ADMIN, UserTypes.SUPER_ADMIN)
  async findCurrent(@AuthData() authData: IAuthData): Promise<AccountResponseDto> {
    return new AccountResponseDto(await this.account.findOne(authData.id));
  }

  /* === Super admin routes === */
  /**
   * Find all accounts
   */
  @Get("all")
  @AllowedFor(UserTypes.SUPER_ADMIN)
  async findAll(): Promise<AccountResponseDto[]> {
    return (await this.account.findAll(false))
      .map(account => new AccountResponseDto(account));
  }

  /**
   * Find single account by ID (PK)
   */
  @Get(":id")
  @AllowedFor(UserTypes.SUPER_ADMIN)
  async findOne(@Param("id", new ParseIntPipe()) id: number): Promise<AccountResponseDto> {
    return new AccountResponseDto(await this.account.findOne(id));
  }

  /**
   * Update single account information by ID (PK)
   */
  @Patch(":id")
  @AllowedFor(UserTypes.SUPER_ADMIN)
  async update(@Param("id", new ParseIntPipe()) id: number,
               @Body() updateDto: UpdateAccountDto): Promise<AccountResponseDto> {
    return new AccountResponseDto(await this.account.update(id, updateDto));
  }

  /**
   * Remove single account by ID (PK)
   */
  @Delete(":id")
  @AllowedFor(UserTypes.SUPER_ADMIN)
  async remove(@Param("id", new ParseIntPipe()) id: number): Promise<ISuccessResponse> {
    return await this.account.remove(id);
  }
}
