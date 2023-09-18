import { Controller, Post, HttpCode, Body, Res } from "@nestjs/common";
import { LoginDTO } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { Public } from "./auth.guard";

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
}
