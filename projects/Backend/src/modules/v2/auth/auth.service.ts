import { randomBytes, randomInt } from "crypto";
import * as argon2 from "argon2";
import { Injectable } from "@nestjs/common";
import { IAccount, IAccountLoginResponse, ISuccessResponse, SUCCESS_RESPONSE } from "@myboothmanager/common";
import { InvalidRequestBodyException } from "@/lib/exceptions";
import { IAuthData, JwtUtilService } from "./jwt-util.service";
import { LoginRequestDto } from "./dto/login.dto";
import { InvalidRefreshTokenException, LoginAccountNotFoundException, LoginSessionAlreadyExistsException, NeedReloginException, RefreshTokenExpiredException } from "./auth.exception";
import { RefreshRequestDto } from "./dto/refresh.dto";
import { LogoutRequestDto } from "./dto/logout.dto";
import AccountService from "../account/account.service";

export type IAccountLoginResponseWithRefreshToken = IAccountLoginResponse & { refreshToken: string };

/** Super admin internal account ID and name will be generated at run-time */
export const SUPER_ADMIN_AUTH_DATA = Object.freeze<IAuthData>({
  id: randomInt(Number.MIN_SAFE_INTEGER, -1),
  name: randomBytes(32).toString("base64"),
});


/** Static storage class for auth tokens */
export default class AuthStorage {
  private constructor() { }

  /** Refresh token UUID memory storage */
  public static readonly REFRESH_UUID_STORE = new Map<number, string>();

  /** Auth token JWT memory storage */
  public static readonly AUTH_TOKEN_STORE = new Map<number, string>();
}

@Injectable()
export class AuthService {
  constructor(
    private account: AccountService,
    private jwtUtil: JwtUtilService,
  ) { }

  /**
   * Generates login response with tokens. If tokens generated successfully, register tokens to memory storage.
   * @param account `IAccount` entity
   * @returns Login response with refresh token
   */
  private async generateLoginResponse(account: IAccount): Promise<IAccountLoginResponseWithRefreshToken> {
    // Generate tokens
    const accessToken = await this.jwtUtil.generateAuthToken(account);
    const refreshToken = await this.jwtUtil.generateRefreshToken(account);

    // Register tokens to memory storage
    AuthStorage.AUTH_TOKEN_STORE.set(account.id, accessToken);
    AuthStorage.REFRESH_UUID_STORE.set(account.id, refreshToken.refreshUUID);

    // Build response
    return {
      id: account.id,
      name: account.name,
      loginId: account.loginId,
      accessToken,
      refreshToken: refreshToken.refreshToken,
      lastSelectedBoothId: account.lastSelectedBoothId,
    };
  }

  /**
   * Do login and authenticate the booth admin account.
   * @param loginDto Login request DTO
   * @param updateLoginCount Whether to update login count and time, if login is successful. default: `true`
   * @returns Login response with refresh token
   */
  async login(loginDto: LoginRequestDto, updateLoginCount: boolean = true): Promise<IAccountLoginResponseWithRefreshToken> {
    const account = await this.account.findOne(loginDto.loginId, false);

    if(!account || !(await argon2.verify(account.loginPassHash, loginDto.loginPass))) {
      // Account is not found or password is incorrect
      throw new LoginAccountNotFoundException();
    } else if(account && AuthStorage.REFRESH_UUID_STORE.has(account.id) && !loginDto.confirmLogoutExistingSession) {
      // Login is acceptable but existing session is found
      throw new LoginSessionAlreadyExistsException();
    } else {
      // Login is acceptable
      if(updateLoginCount) {
        // Update login count and time
        await (await account.update({
          lastLoginAt: new Date(),
          loginCount: account.loginCount + 1,
        })).save();
      }

      // Generate login response
      return await this.generateLoginResponse(account);
    }
  }

  /**
   * Do login and authenticate the super admin account.
   * @returns Login response with refresh token
   */
  async loginSA(): Promise<IAccountLoginResponseWithRefreshToken> {
    const accessToken = await this.jwtUtil.generateAuthToken(SUPER_ADMIN_AUTH_DATA);
    const refreshToken = await this.jwtUtil.generateRefreshToken(SUPER_ADMIN_AUTH_DATA);

    return {
      ...SUPER_ADMIN_AUTH_DATA,
      loginId: process.env.SUPERADMIN_ID!,
      accessToken,
      refreshToken: refreshToken.refreshToken,
      superAdmin: true,
    };
  }

  /**
   * Do logout and delete refresh token from memory storage.
   * @param logoutDto Logout request DTO
   * @returns Success
   */
  logout(logoutDto: LogoutRequestDto): ISuccessResponse {
    AuthStorage.REFRESH_UUID_STORE.delete(logoutDto.id);
    return SUCCESS_RESPONSE;
  }

  /**
   * Do refresh and generate new tokens if refresh token is valid.
   * @param refreshDto Refresh request DTO
   * @param refreshToken Refresh token from cookie
   * @returns Login response with newly generated auth/refresh token
   */
  async refresh(refreshDto: RefreshRequestDto, refreshToken?: string | null): Promise<IAccountLoginResponseWithRefreshToken> {
    // Invalid refresh token is not acceptable
    if(!refreshToken) throw new InvalidRequestBodyException();

    // Verify
    const verifyResult = await this.jwtUtil.verifyRefreshToken(refreshToken);

    // If verification is success, check if refresh UUID is matched with stored one
    if(typeof verifyResult === "object" && verifyResult?.id) {
      const refreshUuid = AuthStorage.REFRESH_UUID_STORE.get(refreshDto.id);

      // If stored refresh UUID is matched, generate new tokens
      if(refreshUuid === verifyResult.refreshUUID) {
        return await this.generateLoginResponse(await this.account.findOne(verifyResult.id));
      }
      // If it isn't, continue to error process
    }

    // If verification is failed, delete stored refresh UUID first...
    AuthStorage.REFRESH_UUID_STORE.delete(refreshDto.id);

    // ...and then throw an error by verification result
    if(typeof verifyResult === "string" && verifyResult === "expired") {
      // Refresh token is expired
      throw new RefreshTokenExpiredException();
    } else if(!verifyResult) {
      // Refresh token can't be verified
      throw new InvalidRefreshTokenException();
    }

    // Need to re-login if error is unknown
    throw new NeedReloginException();
  }
}
