import { Injectable } from "@nestjs/common";
import * as argon2 from "argon2";
import { IAccount, IAccountLoginResponse, ISuccessResponse, SUCCESS_RESPONSE } from "@myboothmanager/common";
import { JwtService } from "@nestjs/jwt";
import { InvalidRequestBodyException } from "@/lib/exceptions";
import { AccountService } from "../account/account.service";
import { IAuthPayload, generateAuthToken, generateAuthTokenSA, generateRefreshToken, verifyRefreshToken } from "./jwt";
import { LoginRequestDto } from "./dto/login.dto";
import { RefreshRequestDto } from "./dto/refresh.dto";
import AuthStorage from "./auth.storage";
import { InvalidRefreshTokenException, LoginAccountNotFoundException, LoginSessionAlreadyExistsException, NeedReloginException, RefreshTokenExpiredException } from "./auth.exception";

const SA_LOGIN_DATA: IAuthPayload = {
  id: -1,
  name: "YOUFOUNDME",
};

@Injectable()
export class AuthService {
  constructor(private accountService: AccountService, private jwtService: JwtService) {}

  private async generateTokenAndLoginResponse(account: IAccount): Promise<IAccountLoginResponse> {
    const generatedToken = await generateAuthToken(this.jwtService, account);
    const generatedRefreshToken = await generateRefreshToken(this.jwtService, account);

    AuthStorage.AUTH_TOKEN_STORE.set(account.id, generatedToken);
    AuthStorage.REFRESH_UUID_STORE.set(account.id, generatedRefreshToken.refreshUUID);

    return {
      id: account.id,
      name: account.name,
      loginId: account.loginId,
      accessToken: generatedToken,
      refreshToken: generatedRefreshToken.refreshToken,
      lastSelectedBoothId: account.lastSelectedBoothId,
    };
  }

  async login(loginDto: LoginRequestDto, updateLoginCount: boolean = true): Promise<IAccountLoginResponse> {
    const account = await this.accountService.findOneByLoginId(loginDto.loginId, false);

    if(!account || !(await argon2.verify(account.loginPassHash, loginDto.loginPass))) {
      throw new LoginAccountNotFoundException();
    } else if(account && AuthStorage.REFRESH_UUID_STORE.has(account.id) && !loginDto.confirmLogoutExistingSession) {
      throw new LoginSessionAlreadyExistsException();
    } else {
      // Update last login time and count
      if(updateLoginCount) {
        await (await account.update({
          lastLoginAt: new Date(),
          loginCount: account.loginCount + 1,
        })).save();
      }

      return await this.generateTokenAndLoginResponse(account);
    }
  }

  async loginSA(): Promise<IAccountLoginResponse> {
    const generatedToken = await generateAuthTokenSA(this.jwtService);
    const generatedRefreshToken = await generateRefreshToken(this.jwtService, SA_LOGIN_DATA);

    return {
      ...SA_LOGIN_DATA,
      loginId: process.env.SUPERADMIN_ID!,
      accessToken: generatedToken,
      refreshToken: generatedRefreshToken.refreshToken,
      superAdmin: true,
    };
  }

  logout(logoutDto: { id: number }): ISuccessResponse {
    AuthStorage.REFRESH_UUID_STORE.delete(logoutDto.id);
    return SUCCESS_RESPONSE;
  }

  async refresh(refreshDto: RefreshRequestDto): Promise<IAccountLoginResponse> {
    if(!refreshDto.refreshToken) throw new InvalidRequestBodyException();

    const verifyResult = await verifyRefreshToken(this.jwtService, refreshDto.refreshToken);
    if(typeof verifyResult === "object" && verifyResult?.id) {
      const refreshUuid = AuthStorage.REFRESH_UUID_STORE.get(refreshDto.id);

      if(refreshUuid === verifyResult.refreshUUID) {
        // All OK
        return await this.generateTokenAndLoginResponse(await this.accountService.findOneById(verifyResult.id));
      }
    }

    // Refresh failed processes
    AuthStorage.REFRESH_UUID_STORE.delete(refreshDto.id);

    if(typeof verifyResult === "string" && verifyResult === "expired") {
      throw new RefreshTokenExpiredException();
    } else if(!verifyResult) {
      throw new InvalidRefreshTokenException();
    } else {
      throw new NeedReloginException();
    }
  }
}
