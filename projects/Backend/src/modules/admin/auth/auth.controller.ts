import { Controller, Post, HttpCode, Body, UseGuards } from "@nestjs/common";
import { LoginDTO } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { AdminAuthGuard, Public } from "./auth.guard";
import { RefreshDTO } from "./dto/refresh.dto";

@UseGuards(AdminAuthGuard)
@Controller("/admin/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("login")
  @HttpCode(200)
  async login(@Body() loginDto: LoginDTO) {
    if(loginDto.loginId === process.env.SUPERADMIN_ID
       && loginDto.loginPass === process.env.SUPERADMIN_PASS) {
      // SuperAdmin login
      return await this.authService.loginSA();
    } else {
      // Normal login
      return await this.authService.login(loginDto);
    }
  }

  @Public()
  @Post("logout")
  @HttpCode(200)
  logout(@Body() logoutDto: { id: number }) {
    return this.authService.logout(logoutDto);
  }

  @Public()
  @Post("refresh")
  @HttpCode(200)
  async refresh(@Body() refreshDto: RefreshDTO) {
    return await this.authService.refresh(refreshDto);
  }
}
