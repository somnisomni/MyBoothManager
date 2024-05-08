import type { FastifyReply, FastifyRequest } from "fastify";
import type { CookieSerializeOptions } from "@fastify/cookie";
import { Controller, Post, HttpCode, Body, UseGuards, Get, UseInterceptors, ClassSerializerInterceptor, Res, Req } from "@nestjs/common";
import { SUCCESS_RESPONSE } from "@myboothmanager/common";
import { LoginRequestDto, LoginResponseDto } from "./dto/login.dto";
import { AuthService, IAccountLoginResponseWithRefreshToken } from "./auth.service";
import { AdminAuthGuard, Public } from "./auth.guard";
import { RefreshRequestDto } from "./dto/refresh.dto";

@UseGuards(AdminAuthGuard)
@Controller("/admin/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private readonly REFRESH_TOKEN_COOKIE_KEY: string = "refreshToken";
  private readonly REFRESH_TOKEN_COOKIE_OPTIONS: Readonly<CookieSerializeOptions> = { path: "/admin/auth/refresh" } as const;
  private setRefreshTokenCookie = (response: FastifyReply, value: string) => response.setCookie(this.REFRESH_TOKEN_COOKIE_KEY, response.signCookie(value), this.REFRESH_TOKEN_COOKIE_OPTIONS);

  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post("login")
  @HttpCode(200)
  async login(@Body() loginDto: LoginRequestDto, @Res({ passthrough: true }) response: FastifyReply): Promise<LoginResponseDto> {
    let data: IAccountLoginResponseWithRefreshToken;

    if(loginDto.loginId === process.env.SUPERADMIN_ID
       && loginDto.loginPass === process.env.SUPERADMIN_PASS) {
      // SuperAdmin login
      data = await this.authService.loginSA();
    } else {
      // Normal login
      data = await this.authService.login(loginDto);
    }

    this.setRefreshTokenCookie(response, data.refreshToken);

    return new LoginResponseDto(data);
  }

  @Public()
  @Post("logout")
  @HttpCode(200)
  logout(@Body() logoutDto: { id: number }, @Res({ passthrough: true }) response: FastifyReply) {
    response.clearCookie(this.REFRESH_TOKEN_COOKIE_KEY);

    return this.authService.logout(logoutDto);
  }

  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post("refresh")
  @HttpCode(200)
  async refresh(@Body() refreshDto: RefreshRequestDto, @Req() request: FastifyRequest, @Res({ passthrough: true }) response: FastifyReply): Promise<LoginResponseDto> {
    const data = await this.authService.refresh(refreshDto, request.unsignCookie(request.cookies[this.REFRESH_TOKEN_COOKIE_KEY] ?? "").value);

    this.setRefreshTokenCookie(response, data.refreshToken);

    return new LoginResponseDto(data);
  }

  @Get("check")
  @HttpCode(200)
  check() {
    return SUCCESS_RESPONSE;
  }
}
