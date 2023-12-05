import type { FastifyRequest } from "fastify";
import { CanActivate, ExecutionContext, Injectable, SetMetadata, createParamDecorator } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { NoAccessException } from "@/lib/exceptions";
import { IAuthPayload, JWT_ALGORITHM, JWT_ISSUER, JWT_SECRET, JWT_SUBJECT } from "./jwt";
import { AuthTokenNeedRefreshException, InvalidAuthTokenException, UnauthorizedNoTokenException } from "./auth.exception";
import AuthStorage from "./auth.storage";

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const IS_SUPERADMIN_KEY = "isSuperAdmin";
export const SuperAdmin = () => SetMetadata(IS_SUPERADMIN_KEY, true);

export const AuthData = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<FastifyRequest>();
  return (req.params as IFastifyRequestParamsCustom).authData;
});

export interface IFastifyRequestParamsCustom {
  authData: IAuthPayload,
  superAdmin?: boolean,
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if(isPublic) return true;

    const isSuperAdmin = this.reflector.getAllAndOverride<boolean>(IS_SUPERADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const token = this.extractAccessTokenFromHeader(req);

    if(!token) throw new UnauthorizedNoTokenException();

    try {
      const payload = await this.jwtService.verifyAsync<IAuthPayload>(token, {
        secret: JWT_SECRET,
        algorithms: [JWT_ALGORITHM],
        issuer: JWT_ISSUER,
        subject: JWT_SUBJECT,
      });

      if(isSuperAdmin && payload.id !== -1) {
        throw new NoAccessException();
      } else {
        (req.params as IFastifyRequestParamsCustom).superAdmin = true;
      }

      (req.params as IFastifyRequestParamsCustom).authData = payload;
    } catch(error) {
      // TokenExpiredError
      if(typeof error === "object" && (error as Record<string, unknown>).expiredAt) {
        throw new AuthTokenNeedRefreshException();
      } else {
        const decodedAccountId = this.jwtService.decode<IAuthPayload>(token)?.id;
        if(decodedAccountId) {
          AuthStorage.REFRESH_UUID_STORE.delete(decodedAccountId);
        }

        throw new InvalidAuthTokenException();
      }
    }

    return true;
  }

  private extractAccessTokenFromHeader(req: FastifyRequest): string | null {
    // Authorization: Bearer <access_token>

    if(!req.headers.authorization) return null;

    const [type, accessToken] = req.headers.authorization.split(" ");
    return type === "Bearer" ? accessToken : null;
  }
}
