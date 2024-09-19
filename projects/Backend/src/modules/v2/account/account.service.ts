import { Injectable } from "@nestjs/common";
import * as argon2 from "argon2";
import Account from "@/db/models/account";
import { create, removeOne, stringCompareCaseSensitive } from "@/lib/common-functions";
import { EntityNotFoundException, InvalidRequestBodyException } from "@/lib/exceptions";
import { ISuccessResponse, SEQUELIZE_INTERNAL_KEYS, SUCCESS_RESPONSE } from "@myboothmanager/common";
import { CreateAccountRequestDto } from "./dto/create.dto";
import { UpdateAccountRequestDto } from "./dto/update.dto";
import { AccountInfoUpdateFailedException, AccountPasswordUpdateFailedException } from "./account.exception";
import { UpdateAccountPasswordRequestDto } from "./dto/update-password.dto";
import { WhereOptions } from "sequelize";
import { SUPER_ADMIN_AUTH_DATA } from "../auth/auth.service";

@Injectable()
export default class AccountService {
  constructor() { }

  /**
   * Find all accounts
   * @param excludeSequelizeInternalKeys Whether to exclude Sequelize internal date keys from the result. default: `true`
   * @returns Array of found `Account` entities
   */
  async findAll(excludeSequelizeInternalKeys = true): Promise<Account[]> {
    const result = await Account.findAll({
      attributes: {
        exclude: [
          ...(excludeSequelizeInternalKeys ? SEQUELIZE_INTERNAL_KEYS : []),
          "loginPassHash",
        ],
      },
    });

    if(!result || result.length <= 0) throw new EntityNotFoundException();

    return result;
  }

  /**
   * Find single account by DB primary key or login ID
   * @param pkOrLoginId **Numeric ID (primary key)** or **string login ID** of the account
   * @param excludePassHash Whether to exclude password hash from the result. default: `true`
   * @returns `Account` entity
   * @throws `EntityNotFoundException` if no account found
   */
  async findOne(pkOrLoginId: number | string, excludePassHash = true): Promise<Account> {
    const where: WhereOptions<Account>
      = typeof pkOrLoginId === "number"
        ? { id: pkOrLoginId }
        : stringCompareCaseSensitive<Account>("loginId", pkOrLoginId);

    const result = await Account.findOne({
      where,
      attributes: {
        exclude: [
          ...SEQUELIZE_INTERNAL_KEYS,
          ...(excludePassHash ? ["loginPassHash"] : []),
        ],
      },
    });

    if(!result) throw new EntityNotFoundException();

    return result;
  }

  /**
   * Create a new booth admin account
   * @param createDto DTO for creating a new account
   * @returns Created `Account` entity
   */
  async create(createDto: CreateAccountRequestDto): Promise<Account> {
    const request: CreateAccountRequestDto & { loginPassHash: string } = {
      ...createDto,
      loginPassHash: await argon2.hash(createDto.loginPass),
    };

    return await create(Account, request);
  }

  /**
   * Update information of an account
   * @param id ID (primary key) of the account
   * @param updateDto DTO for updating account information
   * @returns Updated `Account` entity
   * @throws `AccountInfoUpdateFailedException` if the update failed
   */
  async update(id: number, updateDto: UpdateAccountRequestDto): Promise<Account> {
    // Updating account information of super admin is prohibited
    if(id === SUPER_ADMIN_AUTH_DATA.id) throw new InvalidRequestBodyException();

    try {
      const account = await this.findOne(id);

      return await (await account.update(updateDto)).save();
    } catch(err) {
      throw new AccountInfoUpdateFailedException();
    }
  }

  /**
   * Update password of an account
   * @param id ID (primary key) of the account
   * @param updatePasswordDto DTO for updating account password
   * @returns `SUCCESS_RESPONSE`
   * @throws `AccountPasswordUpdateFailedException` if the update failed
   */
  async updatePassword(id: number, updatePasswordDto: UpdateAccountPasswordRequestDto): Promise<ISuccessResponse> {
    // Updating account information of super admin is prohibited
    if(id === SUPER_ADMIN_AUTH_DATA.id) throw new InvalidRequestBodyException();

    try {
      const account = await this.findOne(id);

      await (await account.update({
        loginPassHash: await argon2.hash(updatePasswordDto.loginPass),
      })).save();

      return SUCCESS_RESPONSE;
    } catch(err) {
      throw new AccountPasswordUpdateFailedException();
    }
  }

  /**
   * Remove an account
   * @param id ID (primary key) of the account
   * @returns `SUCCESS_RESPONSE`
   */
  async remove(id: number): Promise<ISuccessResponse> {
    // TODO: Remove all booths associated with the account

    return await removeOne(Account, { id });
  }
}
