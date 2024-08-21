import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AccountModule } from "../account/account.module";
import { JWT_ALGORITHM, JWT_ISSUER, JWT_SECRET, JWT_SUBJECT } from "./jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

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
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
