import { IAccount } from "@myboothmanager/common";
import * as jwt from "jsonwebtoken";
import * as uuid from "uuid";

const JWT_SECRET: string = process.env.JWT_SECRET || "myboothmanager";
const JWT_ISSUER: string = "myboothmanager";
const JWT_SUBJECT: string = "admin";
const JWT_ALGORITHM: jwt.Algorithm = "HS384";

export enum JWTVerifyResult {
  OK,
  InvalidToken,
  ExpiredToken,
  Unknown,
}

export function generateLoginToken(account: IAccount): { token: string; tokenExpiresIn: string, refreshToken: string, refreshTokenExpiresIn: string } {
  const payload = {
    id: account.id,
    loginId: account.loginId,
    name: account.name,
  };

  const tokenExpiresIn = "8h";
  const refreshTokenExpiresIn = "2d";

  return {
    token: jwt.sign(payload, JWT_SECRET, { issuer: JWT_ISSUER, subject: JWT_SUBJECT, expiresIn: tokenExpiresIn, algorithm: JWT_ALGORITHM }),
    tokenExpiresIn,
    refreshToken: uuid.v4(),
    refreshTokenExpiresIn,
  };
}

export function generateLoginTokenSA(): { token: string; tokenExpiresIn: string, refreshToken: string, refreshTokenExpiresIn: string } {
  return generateLoginToken({
    id: -1,
    loginId: process.env.SUPERADMIN_ID!,
    name: "SUPER ADMIN",
    lastLoginAt: new Date(),
    loginCount: -1,
    loginPassHash: process.env.SUPERADMIN_PASS!,
  });
}

export function verifyLoginToken(token: string): JWTVerifyResult {
  try {
    jwt.verify(token, JWT_SECRET, { issuer: JWT_ISSUER, subject: JWT_SUBJECT });
    return JWTVerifyResult.OK;
  } catch(error) {
    if(error instanceof jwt.JsonWebTokenError) {
      if(error.message === "expired token") {
        return JWTVerifyResult.ExpiredToken;
      } else {
        return JWTVerifyResult.InvalidToken;
      }
    }
  }

  return JWTVerifyResult.Unknown;
}

export function decodeLoginToken(token: string): jwt.JwtPayload {
  return jwt.verify(token, JWT_SECRET, { issuer: JWT_ISSUER, subject: JWT_SUBJECT }) as jwt.JwtPayload;
}
