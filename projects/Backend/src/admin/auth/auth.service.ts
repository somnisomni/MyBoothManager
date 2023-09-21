import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as argon2 from "argon2";
import { IAccount, IAccountLoginResponse } from "@myboothmanager/common";
import { JwtService } from "@nestjs/jwt";
import { AccountService } from "../account/account.service";
import { IAuthPayload, generateLoginToken, generateLoginTokenSA } from "./jwt";
import { LoginDTO } from "./dto/login.dto";
import { RefreshDTO } from "./dto/refresh.dto";

@Injectable()
export class AuthService {
  constructor(private accountService: AccountService, private jwtService: JwtService) {}

  private async generateTokenAndLoginResponse(account: IAccount): Promise<IAccountLoginResponse> {
    const generatedTokenData = await generateLoginToken(this.jwtService, account);

    return {
      id: account.id,
      name: account.name,
      loginId: account.loginId,
      ...generatedTokenData,
    };
  }

  async login(loginDto: LoginDTO, updateLoginCount: boolean = true): Promise<IAccountLoginResponse> {
    const account = await this.accountService.findOneByLoginId(loginDto.loginId);

    if(!account || !(await argon2.verify(account.loginPassHash, loginDto.loginPass))) {
      throw new UnauthorizedException("계정을 찾을 수 없거나 입력한 정보와 일치하지 않습니다.");
    } else {
      // Update last login time and count
      if(updateLoginCount) {
        account.update({
          lastLoginAt: new Date(),
          loginCount: account.loginCount + 1,
        });
      }

      return await this.generateTokenAndLoginResponse(account);
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

  async refresh(refreshDto: RefreshDTO, authData: IAuthPayload): Promise<IAccountLoginResponse> {
    if(!refreshDto.refreshToken) throw new UnauthorizedException("유효한 토큰이 아닙니다.");

    // TODO: Implement refresh token logic

    return await this.generateTokenAndLoginResponse(await this.accountService.findOneById(authData.id));
  }
}
