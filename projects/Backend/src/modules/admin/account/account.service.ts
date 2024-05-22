import * as argon2 from "argon2";
import { Injectable, NotImplementedException } from "@nestjs/common";
import { ISuccessResponse, SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import Account from "@/db/models/account";
import { create, removeOne, stringCompareCaseSensitive } from "@/lib/common-functions";
import { EntityNotFoundException } from "@/lib/exceptions";
import { IAuthPayload } from "../auth/jwt";
import { CreateAccountDTO } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";

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
          "loginPassHash",
        ],
      },
    });

    if(result && result.length > 0) return result;
    else throw new EntityNotFoundException();
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
    else throw new EntityNotFoundException();
  }

  async findOneByLoginId(loginId: string, excludePassHash: boolean = true): Promise<Account> {
    const result = await Account.findOne({
      where: stringCompareCaseSensitive<Account>("loginId", loginId),
      attributes: {
        exclude: [
          ...SEQUELIZE_INTERNAL_KEYS,
          ...(excludePassHash ? ["loginPassHash"] : []),
        ],
      },
    });

    if(result) return result;
    else throw new EntityNotFoundException();
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    throw new NotImplementedException("ACCOUNT UPDATE NOT IMPLEMENTED");
  }

  async remove(id: number): Promise<ISuccessResponse> {
    return await removeOne(Account, { id });
  }
}
