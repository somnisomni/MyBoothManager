import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateAccountDTO } from "./dto/create-account.dto";
import { UpdateAccountDTO } from "./dto/update-account.dto";
import { LoginDTO } from "./dto/login.dto";
import Account from "@/db/models/account";
import * as argon2 from "argon2";
import { IAccountLoginResponse } from "@myboothmanager/common";
import { JWTVerifyResult, generateLoginToken, generateLoginTokenSA, verifyLoginToken } from "./jwt";

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
        const generatedToken = generateLoginToken(account);

        if(verifyLoginToken(generatedToken.token) !== JWTVerifyResult.OK) {
          throw new InternalServerErrorException("로그인 토큰을 생성할 수 없습니다.");
        }

        return {
          id: account.id,
          name: account.name,
          loginId: account.loginId,

          token: generatedToken.token,
          tokenExpiresIn: generatedToken.tokenExpiresIn,
          refreshToken: generatedToken.refreshToken,
          refreshTokenExpiresIn: generatedToken.refreshTokenExpiresIn,
        };
      }
    }

    throw new ForbiddenException("계정을 찾을 수 없거나 입력한 정보와 일치하지 않습니다.");
  }

  async loginSA(): Promise<IAccountLoginResponse> {
    const generatedToken = generateLoginTokenSA();

    return {
      id: -1,
      name: "SUPER ADMIN",
      loginId: process.env.SUPERADMIN_ID!,

      token: generatedToken.token,
      tokenExpiresIn: generatedToken.tokenExpiresIn,
      refreshToken: generatedToken.refreshToken,
      refreshTokenExpiresIn: generatedToken.refreshTokenExpiresIn,
      superAdmin: true,
    };
  }
}
