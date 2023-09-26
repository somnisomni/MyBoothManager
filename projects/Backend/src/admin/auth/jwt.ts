import { randomUUID } from "crypto";
import { IAccount } from "@myboothmanager/common";
import { JwtService } from "@nestjs/jwt";

export const JWT_SECRET: string = process.env.JWT_SECRET || "myboothmanager";
export const JWT_SECRET_REFRESH: string = `${new Date().toISOString()}_${JWT_SECRET}-refresh`;
export const JWT_ISSUER: string = "myboothmanager";
export const JWT_SUBJECT: string = "admin";
export const JWT_SUBJECT_REFRESH: string = `${JWT_SUBJECT}-refresh`;
export const JWT_ALGORITHM: "HS256" | "HS384" = "HS384";

export type IAuthPayload = Pick<IAccount, "id" | "loginId" | "name">;

export interface IRefreshPayload {
  id: number;
  refreshUUID: string;
}

export async function generateAuthToken(jwtService: JwtService, account: IAuthPayload): Promise<string> {
  const payload: IAuthPayload = {
    id: account.id,
    loginId: account.loginId,
    name: account.name,
  };

  return await jwtService.signAsync(payload);
}

export async function generateAuthTokenSA(jwtService: JwtService): Promise<string> {
  return await generateAuthToken(jwtService, {
    id: -1,
    loginId: process.env.SUPERADMIN_ID!,
    name: "SUPER ADMIN",
  });
}

export async function generateRefreshToken(jwtService: JwtService, account: IAuthPayload): Promise<{ refreshUUID: string, refreshToken: string }> {
  const payload: IRefreshPayload = {
    id: account.id,
    refreshUUID: randomUUID(),
  };
  const token = await jwtService.signAsync(payload, {
    secret: JWT_SECRET_REFRESH,
    algorithm: JWT_ALGORITHM,
    issuer: JWT_ISSUER,
    subject: JWT_SUBJECT_REFRESH,
    expiresIn: "8h",
  });

  return {
    refreshUUID: payload.refreshUUID,
    refreshToken: token,
  };
}

export async function verifyRefreshToken(jwtService: JwtService, token: string): Promise<IRefreshPayload | "expired" | null> {
  try {
    const result = await jwtService.verifyAsync(token, {
      secret: JWT_SECRET_REFRESH,
      issuer: JWT_ISSUER,
      subject: JWT_SUBJECT_REFRESH,
      complete: true,
    });
    return result as unknown as IRefreshPayload;
  } catch(error) {
    // error instanceof jwt.JsonWebTokenError
    if(error && typeof error === "object" && (error as Record<string, string>).message) {
      if((error as Record<string, string>).message === "expired token") {
        return "expired";
      } else {
        // Invalid
      }
    }

    return null;
  }
}
