import { randomUUID } from "crypto";
import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { IAccount } from "@myboothmanager/common";

export const JWT_SECRET: string = `${(process.env.JWT_SECRET || "myboothmanager")}${new Date().getTime()}`;
export const JWT_SECRET_REFRESH: string = `${JWT_SECRET}-refresh`;
export const JWT_ISSUER: string = "myboothmanager";
export const JWT_SUBJECT: string = "admin";
export const JWT_SUBJECT_REFRESH: string = `${JWT_SUBJECT}-refresh`;
export const JWT_ALGORITHM: "HS256" | "HS384" = "HS384";

/**
 * Auth data interface containing essential information for identifying the user
 *
 * This interface is also used for generating JWT token
 */
export interface IAuthData extends Pick<IAccount, "id" | "name"> {
  /** ID of logged in account */
  id: number;

  /** Name of logged in account */
  name: string;
}

export interface IRefreshData {
  id: number;
  refreshUUID: string;
}

@Injectable()
export class JwtUtilService {
  constructor(
    private jwt: JwtService,
  ) { }

  async generateAuthToken(account: IAuthData): Promise<string> {
    const payload: IAuthData = {
      id: account.id,
      name: account.name,
    };

    return await this.jwt.signAsync(payload);
  }

  async generateRefreshToken(account: IAuthData): Promise<{ refreshUUID: string, refreshToken: string }> {
    const payload: IRefreshData = {
      id: account.id,
      refreshUUID: randomUUID(),
    };
    const token = await this.jwt.signAsync(payload, {
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

  async verifyRefreshToken(token: string): Promise<IRefreshData | "expired" | null> {
    try {
      const result = (await this.jwt.verifyAsync(token, {
        secret: JWT_SECRET_REFRESH,
        issuer: JWT_ISSUER,
        subject: JWT_SUBJECT_REFRESH,
        complete: true,
      }) as { header: object, payload: object, signature: string }).payload;
      return result as IRefreshData;
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
}
