import { Controller, Post, HttpCode, Body, UseGuards, Get, UseInterceptors, ClassSerializerInterceptor } from "@nestjs/common";
import { SUCCESS_RESPONSE } from "@myboothmanager/common";
import { LoginRequestDto, LoginResponseDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { AdminAuthGuard, Public } from "./auth.guard";
import { RefreshRequestDto } from "./dto/refresh.dto";

@UseGuards(AdminAuthGuard)
@Controller("/admin/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post("login")
  @HttpCode(200)
  async login(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    if(loginDto.loginId === process.env.SUPERADMIN_ID
       && loginDto.loginPass === process.env.SUPERADMIN_PASS) {
      // SuperAdmin login
      return new LoginResponseDto(await this.authService.loginSA());
    } else {
      // Normal login
      return new LoginResponseDto(await this.authService.login(loginDto));
    }
  }

  @Public()
  @Post("logout")
  @HttpCode(200)
  logout(@Body() logoutDto: { id: number }) {
    return this.authService.logout(logoutDto);
  }

  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post("refresh")
  @HttpCode(200)
  async refresh(@Body() refreshDto: RefreshRequestDto): Promise<LoginResponseDto> {
    return new LoginResponseDto(await this.authService.refresh(refreshDto));
  }

  @Get("check")
  @HttpCode(200)
  check() {
    return SUCCESS_RESPONSE;
  }
}
