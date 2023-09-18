import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { LoginDTO } from "./dto/login.dto";
import * as argon2 from "argon2";
import { IAccountLoginResponse } from "@myboothmanager/common";
import { generateLoginToken, generateLoginTokenSA } from "./jwt";
import { JwtService } from "@nestjs/jwt";
import { AccountService } from "../account/account.service";

@Injectable()
export class AuthService {
  constructor(private accountService: AccountService, private jwtService: JwtService) {}

  async login(loginDto: LoginDTO): Promise<IAccountLoginResponse> {
    const account = await this.accountService.findOneByLoginId(loginDto.loginId);

    if(!account || !(await argon2.verify(account.loginPassHash, loginDto.loginPass))) {
      throw new UnauthorizedException("계정을 찾을 수 없거나 입력한 정보와 일치하지 않습니다.");
    } else {
      const generatedTokenData = await generateLoginToken(this.jwtService, account);

      // Update last login time and count
      account.update({
        lastLoginAt: new Date(),
        loginCount: account.loginCount + 1,
      });

      return {
        id: account.id,
        name: account.name,
        loginId: account.loginId,
        ...generatedTokenData,
      };
    }
  }

  async loginSA(): Promise<IAccountLoginResponse> {
    const generatedTokenData = await generateLoginTokenSA(this.jwtService);

    return {
      id: -1,
      name: "SUPER ADMIN",
      loginId: process.env.SUPERADMIN_ID!,
      ...generatedTokenData,
      superAdmin: true,
    };
  }
}
