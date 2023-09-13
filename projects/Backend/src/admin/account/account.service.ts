import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateAccountDTO } from "./dto/create-account.dto";
import { UpdateAccountDTO } from "./dto/update-account.dto";
import { LoginDTO } from "./dto/login.dto";
import Account from "@/db/models/account";
import * as argon2 from "argon2";
import { IAccountLoginResponse } from "@myboothmanager/common";

@Injectable()
export class AccountService {
  create(createAccountDto: CreateAccountDTO) {
    return "This action adds a new account";
  }

  findAll() {
    return "This action returns all account";
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  update(id: number, updateAccountDto: UpdateAccountDTO) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }

  async login(loginDto: LoginDTO): Promise<IAccountLoginResponse> {
    const account = await Account.findOne({
      where: {
        loginId: loginDto.loginId,
      },
    });

    if(account) {
      if(await argon2.verify(account.loginPassHash, loginDto.loginPass)) {
        return {
          loginId: account.loginId,
          token: "TEST TOKEN",  // TODO: Generate a real token
        };
      }
    }

    throw new ForbiddenException("Account not found or password is incorrect");
  }
}
