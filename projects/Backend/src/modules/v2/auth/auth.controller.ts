import { Body, Controller, Get, HttpCode, Post, Req, Res } from "@nestjs/common";
import { AuthService, IAccountLoginResponseWithRefreshToken } from "./auth.service";
import { CookieSerializeOptions } from "@fastify/cookie";
import { FastifyReply, FastifyRequest } from "fastify";
import { LoginRequestDto, LoginResponseDto } from "./dto/login.dto";
import { RefreshRequestDto } from "./dto/refresh.dto";
import { AllowedFor, UserTypes } from "./auth.guard";
import { LogoutRequestDto } from "./dto/logout.dto";
import { ISuccessResponse, SUCCESS_RESPONSE } from "@myboothmanager/common";
import { AppModuleV2 } from "../app.v2.module";

@Controller("/auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
  ) { }

  private readonly REFRESH_TOKEN_COOKIE_KEY = "refreshToken" as const;
  private readonly REFRESH_TOKEN_COOKIE_OPTIONS: Readonly<CookieSerializeOptions> = { path: `/${AppModuleV2.ROUTE_PREFIX}/auth/refresh` as const } as const;
  private setRefreshTokenCookie = (response: FastifyReply, value: string) => response.setCookie(this.REFRESH_TOKEN_COOKIE_KEY, response.signCookie(value), this.REFRESH_TOKEN_COOKIE_OPTIONS);

  /* === Public routes === */
  /**
   * Login with login ID and password
   */
  @Post("login")
  @HttpCode(200)
  async login(@Body() loginDto: LoginRequestDto,
              @Res({ passthrough: true }) response: FastifyReply): Promise<LoginResponseDto> {
    let data: IAccountLoginResponseWithRefreshToken;

    if(loginDto.loginId === process.env.SUPERADMIN_ID
       && loginDto.loginPass === process.env.SUPERADMIN_PASS) {
      // Super Admin
      data = await this.auth.loginSA();
    } else {
      // Normal (booth admin)
      data = await this.auth.login(loginDto);
    }

    // Set refresh token cookie
    this.setRefreshTokenCookie(response, data.refreshToken);

    return new LoginResponseDto(data);
  }

  /**
   * Logout
   * TODO: Logout only if ID in the auth token matches the ID in the request body. To do that, parsed raw auth token (regardless expiracy) should be provided
   */
  @Post("logout")
  @HttpCode(200)
  logout(@Body() logoutDto: LogoutRequestDto,
         @Res({ passthrough: true }) response: FastifyReply): ISuccessResponse {
    // Clear refresh token cookie
    response.clearCookie(this.REFRESH_TOKEN_COOKIE_KEY);

    return this.auth.logout(logoutDto);
  }

  /**
   * Refresh access token using refresh token
   */
  @Post("refresh")
  @HttpCode(200)
  async refresh(@Body() refreshDto: RefreshRequestDto,
                @Req() request: FastifyRequest,
                @Res({ passthrough: true }) response: FastifyReply): Promise<LoginResponseDto> {
    // Do refresh using old refresh token cookie
    const data = await this.auth.refresh(refreshDto, request.unsignCookie(request.cookies[this.REFRESH_TOKEN_COOKIE_KEY] ?? "").value);

    // Set new refresh token cookie
    this.setRefreshTokenCookie(response, data.refreshToken);

    return new LoginResponseDto(data);
  }

  /* === Admin routes === */
  /**
   * Check if the user is logged in and has a valid access token
   */
  @Get("check")
  @HttpCode(200)
  @AllowedFor(UserTypes.BOOTH_ADMIN, UserTypes.SUPER_ADMIN)
  check(): ISuccessResponse {
    return SUCCESS_RESPONSE;
  }
}
