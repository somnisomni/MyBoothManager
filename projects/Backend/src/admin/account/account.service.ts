import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateAccountDTO } from "./dto/create-account.dto";
import { UpdateAccountDTO } from "./dto/update-account.dto";
import Account from "@/db/models/account";
import { SEQUELIZE_INTERNAL_KEYS } from "@myboothmanager/common";
import { IAuthPayload } from "../auth/jwt";

@Injectable()
export class AccountService {
  create(createAccountDto: CreateAccountDTO) {
    return "This action adds a new account";
  }

  async findCurrent(authData: IAuthPayload): Promise<Account> {
    return await this.findOneById(authData.id);
  }

  findAll() {
    return "This action returns all account";
  }

  async findOneById(id: number): Promise<Account> {
    const result = await Account.findOne({
      where: { id },
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });

    if(result) return result;
    else throw new NotFoundException("계정을 찾을 수 없습니다.");
  }

  async findOneByLoginId(loginId: string): Promise<Account> {
    const result = await Account.findOne({
      where: { loginId },
      attributes: {
        exclude: SEQUELIZE_INTERNAL_KEYS,
      },
    });

    if(result) return result;
    else throw new NotFoundException("계정을 찾을 수 없습니다.");
  }

  update(id: number, updateAccountDto: UpdateAccountDTO) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
