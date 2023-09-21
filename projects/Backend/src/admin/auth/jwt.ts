import { randomUUID } from "crypto";
import { IAccount, IAccountLoginTokenData } from "@myboothmanager/common";
import { JwtService } from "@nestjs/jwt";

export const JWT_SECRET: string = process.env.JWT_SECRET || "myboothmanager";
export const JWT_ISSUER: string = "myboothmanager";
export const JWT_SUBJECT: string = "admin";
export const JWT_ALGORITHM: "HS256" | "HS384" = "HS384";

export enum JWTVerifyResult {
  OK,
  InvalidToken,
  ExpiredToken,
  Unknown,
}

export interface IAuthPayload {
  id: number;
  loginId: string;
  name: string;
}

export async function generateLoginToken(jwtService: JwtService, account: IAccount): Promise<IAccountLoginTokenData> {
  const payload: IAuthPayload = {
    id: account.id,
    loginId: account.loginId,
    name: account.name,
  };

  return {
    accessToken: await jwtService.signAsync(payload),
    refreshToken: randomUUID(),
  };
}

export async function generateLoginTokenSA(jwtService: JwtService): Promise<IAccountLoginTokenData> {
  return await generateLoginToken(jwtService, {
    id: -1,
    loginId: process.env.SUPERADMIN_ID!,
    name: "SUPER ADMIN",
    lastLoginAt: new Date(),
    loginCount: -1,
    loginPassHash: process.env.SUPERADMIN_PASS!,
  });
}

// export function verifyLoginToken(token: string): JWTVerifyResult {
//   try {
//     jwt.verify(token, JWT_SECRET, { issuer: JWT_ISSUER, subject: JWT_SUBJECT });
//     return JWTVerifyResult.OK;
//   } catch(error) {
//     if(error instanceof jwt.JsonWebTokenError) {
//       if(error.message === "expired token") {
//         return JWTVerifyResult.ExpiredToken;
//       } else {
//         return JWTVerifyResult.InvalidToken;
//       }
//     }
//   }

//   return JWTVerifyResult.Unknown;
// }

// export function decodeLoginToken(token: string): jwt.JwtPayload {
//   return jwt.verify(token, JWT_SECRET, { issuer: JWT_ISSUER, subject: JWT_SUBJECT }) as jwt.JwtPayload;
// }
