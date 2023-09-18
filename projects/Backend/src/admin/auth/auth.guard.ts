import { CanActivate, ExecutionContext, Injectable, SetMetadata, UnauthorizedException, createParamDecorator } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FastifyRequest } from "fastify";
import { IAuthPayload, JWT_ALGORITHM, JWT_ISSUER, JWT_SECRET, JWT_SUBJECT } from "./jwt";
import { Reflector } from "@nestjs/core";

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

    if(!token) throw new UnauthorizedException("접근할 수 있는 권한이 없습니다.");

    try {
      const payload = await this.jwtService.verifyAsync<IAuthPayload>(token, {
        secret: JWT_SECRET,
        algorithms: [JWT_ALGORITHM],
        issuer: JWT_ISSUER,
        subject: JWT_SUBJECT,
      });

      if(isSuperAdmin && !(payload.id === -1 && payload.loginId === process.env.SUPERADMIN_ID!)) {
        throw new UnauthorizedException("접근할 수 있는 권한이 없습니다.");
      } else {
        (req.params as IFastifyRequestParamsCustom).superAdmin = true;
      }

      (req.params as IFastifyRequestParamsCustom).authData = payload;
    } catch {
      throw new UnauthorizedException("접근 권한이 유효하지 않거나 만료되었습니다.");
    }

    return true;
  }

  private extractAccessTokenFromHeader(req: FastifyRequest): string | null {
    if(!req.headers.authorization) return null;

    const [type, accessToken] = req.headers.authorization.split(" ");
    return type === "Bearer" ? accessToken : null;
  }
}
