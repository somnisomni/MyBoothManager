import { CanActivate, createParamDecorator, ExecutionContext, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { FastifyRequest } from "fastify";
import { IAuthData, JWT_ALGORITHM, JWT_ISSUER, JWT_SECRET, JWT_SUBJECT } from "./jwt-util.service";
import { AuthTokenNeedRefreshException, InvalidAuthTokenException } from "./auth.exception";
import { AuthStorage } from "./auth.service";
import { NoAccessException } from "@/lib/exceptions";

/**
 * Request user type
 */
export enum UserTypes {
  /** Public(unauthenticated, guest) user */
  PUBLIC = 0b0000,

  /** Booth admin user */
  BOOTH_ADMIN = 0b0001,

  /** Super(system) admin user */
  SUPER_ADMIN = 0b1111,
}

/**
 * User type utility class
 */
export class UserTypeUtil {
  /**
   * Determines if the user type has the permission(other user type)
   * @param userType Provided user type
   * @param permission Permission to check
   * @returns `true` if the user type has the permission, otherwise `false`
   */
  public static havePermission(userType: UserTypes, permission: UserTypes): boolean {
    return (userType & permission) === permission;
  }
}

/**
 * Custom request parameters interface
 *
 * Wrap `FastifyRequest.params` with this
 */
export interface ICustomRequestParams {
  userType: UserTypes;
  authData?: IAuthData;
}

/**
 * `AllowedFor` decorator key
 */
export const ALLOWED_FOR_KEY = "permission";

/**
 * `AllowedFor` decorator, to specify which user type can access the route.
 *
 * If this decorator is not specified, the route is allowed for all user types.
 *
 * If some user types are specified, the access permission is determined by OR condition. This means, if the user type matches at least one of the specified user types, the user can access the route.
 *
 * This decorator can be used when if WHOLE logic of the route should be limited to specified user types.
 * If you want to limit only some part of the route or should have conditional branch for multiple user types,
 *  you can make use of `UserType` parameter decorator and `UserTypeUtil.havePermission()` function instead.
 *
 * @param permissions One or more user types that can access the route
 */
export const AllowedFor = (...permissions: UserTypes[]) => SetMetadata(ALLOWED_FOR_KEY, permissions);

/**
 * Parameter decorator for user type.
 * This only can be used in the context with `AuthGuard` injected.
 *
 * Decorator returns `UserType` enum value. At least `UserTypes.PUBLIC` is guaranteed.
 */
export const UserType = createParamDecorator((data: unknown, context: ExecutionContext): UserTypes => {
  const params = context.switchToHttp().getRequest<FastifyRequest>().params as ICustomRequestParams;
  return params.userType;
});

/**
 * Parameter decorator for auth data.
 * This only can be used in the context with `AuthGuard` injected.
 *
 * Decorator returns `IAuthData` object, but it can be `undefined` if the user is not authenticated
 */
export const AuthData = createParamDecorator((data: unknown, context: ExecutionContext): IAuthData | undefined => {
  const params = context.switchToHttp().getRequest<FastifyRequest>().params as ICustomRequestParams;
  return params.authData;
});

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const params = request.params as ICustomRequestParams;
    const token = this.extractAccessTokenFromHeader(request);

    // By default the user type is public.
    params.userType = UserTypes.PUBLIC;

    if(token) {
      // If authorization token is provided, process admin determination
      try {
        // Verify JWT token
        const payload = await this.jwt.verifyAsync<IAuthData>(token, {
          secret: JWT_SECRET,
          algorithms: [JWT_ALGORITHM],
          issuer: JWT_ISSUER,
          subject: JWT_SUBJECT,
        });

        // If token is valid, set user type
        if(payload.id === -1) {
          params.userType = UserTypes.SUPER_ADMIN;
        } else {
          params.userType = UserTypes.BOOTH_ADMIN;
        }
      } catch(error) {
        // If token is available but invalid, should throw an error

        // TokenExpiredError - token is expired and need to be refreshed
        if(error instanceof TokenExpiredError || (error as Record<string, unknown>).expiredAt) {
          throw new AuthTokenNeedRefreshException();
        }

        // Other errors - invalidate token
        const decodedAccountId = this.jwt.decode<IAuthData>(token)?.id;
        if(decodedAccountId) {
          AuthStorage.REFRESH_UUID_STORE.delete(decodedAccountId);
        }
        throw new InvalidAuthTokenException();
      }
    }

    // After user type determination, check `AllowedFor` decorator
    const allowedFor = this.reflector.getAllAndOverride<UserTypes[]>(ALLOWED_FOR_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if(allowedFor && allowedFor.length > 0) {
      // Check only if `AllowedFor` decorator is specified and has at least one user type

      let isAllowed = false;
      for(const permission of allowedFor) {
        if(UserTypeUtil.havePermission((request.params as ICustomRequestParams).userType, permission)) {
          isAllowed = true;
          break;
        }
      }

      if(!isAllowed) {
        // If user has no permission to access the route, throw an error
        throw new NoAccessException();
      }
    }

    return true;
  }

  private extractAccessTokenFromHeader(request: FastifyRequest): string | null {
    // Authorization: Bearer <access_token>
    if(!request.headers.authorization) return null;

    const [ type, accessToken ] = request.headers.authorization.split(" ");
    return type === "Bearer" ? accessToken : null;
  }
}
