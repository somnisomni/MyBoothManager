import * as argon2 from "argon2";
import { Injectable, NotImplementedException } from "@nestjs/common";
import { ISuccessResponse, SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import Account from "@/db/models/account";
import { create, removeOne } from "@/lib/common-functions";
import { IAuthPayload } from "../auth/jwt";
import { CreateAccountDTO } from "./dto/create-account.dto";
import { UpdateAccountDTO } from "./dto/update-account.dto";
import { AccountNotFoundException } from "./account.exception";

@Injectable()
export class AccountService {
  async create(createAccountDto: CreateAccountDTO): Promise<Account> {
    const request: CreateAccountDTO & { loginPassHash: string } = {
      ...createAccountDto,
      loginPassHash: await argon2.hash(createAccountDto.loginPass),
    };

    return await create(Account, request);
  }

  async findCurrent(authData: IAuthPayload): Promise<Account> {
    return await this.findOneById(authData.id);
  }

  async findAll(): Promise<Array<Account>> {
    const result = await Account.findAll({
      attributes: {
        exclude: [
          ...SEQUELIZE_INTERNAL_KEYS,
          "loginPassHash",
        ],
      },
    });

    if(result && result.length > 0) return result;
    else throw new AccountNotFoundException();
  }

  async findOneById(id: number): Promise<Account> {
    const result = await Account.findOne({
      where: { id },
      attributes: {
        exclude: [
          ...SEQUELIZE_INTERNAL_KEYS,
          "loginPassHash",
        ],
      },
    });

    if(result) return result;
    else throw new AccountNotFoundException();
  }

  async findOneByLoginId(loginId: string, excludePassHash: boolean = true): Promise<Account> {
    const result = await Account.findOne({
      where: { loginId },
      attributes: {
        exclude: [
          ...SEQUELIZE_INTERNAL_KEYS,
          ...(excludePassHash ? ["loginPassHash"] : []),
        ],
      },
    });

    if(result) return result;
    else throw new AccountNotFoundException();
  }

  update(id: number, updateAccountDto: UpdateAccountDTO) {
    throw new NotImplementedException("ACCOUNT DATA UPDATE NOT IMPLEMENTED");
  }

  async remove(id: number): Promise<ISuccessResponse> {
    return await removeOne(Account, { id });
  }
}
