import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JWT_ALGORITHM, JWT_ISSUER, JWT_SECRET, JWT_SUBJECT, JwtUtilService } from "./jwt-util.service";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import AccountModule from "../account/account.module";

@Module({
  imports: [
    AccountModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: {
        expiresIn: "15m",
        algorithm: JWT_ALGORITHM,
        issuer: JWT_ISSUER,
        subject: JWT_SUBJECT,
      },
    }),
  ],
  providers: [
    AuthService,
    JwtUtilService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
