import { Controller, Post, HttpCode, Body } from "@nestjs/common";
import { LoginDTO } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { AuthData, Public } from "./auth.guard";
import { IAuthPayload } from "./jwt";
import { RefreshDTO } from "./dto/refresh.dto";

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

  @Post("refresh")
  async refresh(@Body() refreshDto: RefreshDTO, @AuthData() authData: IAuthPayload) {
    return await this.authService.refresh(refreshDto, authData);
  }
}
