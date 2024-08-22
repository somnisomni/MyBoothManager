import { CanActivate, createParamDecorator, ExecutionContext, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { FastifyRequest } from "fastify";
import { IAuthData, JWT_ALGORITHM, JWT_ISSUER, JWT_SECRET, JWT_SUBJECT } from "./jwt-util.service";
import { AuthTokenNeedRefreshException, InvalidAuthTokenException } from "./auth.exception";
import { AuthStorage } from "./auth.service";

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
 * Parameter decorator for user type
 *
 * Decorator returns `UserType` enum value
 */
export const UserType = createParamDecorator((data: unknown, context: ExecutionContext): UserTypes => {
  const request = context.switchToHttp().getRequest<FastifyRequest>();
  return (request.params as ICustomRequestParams).userType;
});

/**
 * `AllowedFor` decorator key
 */
export const ALLOWED_FOR_KEY = "permission";

/**
 * `AllowedFor` decorator, to specify which user type can access the route
 *
 * If this decorator is not specified, the route is allowed for all user types
 *
 * This decorator can be used when if WHOLE logic of the route should be limited to specified user types.
 * If you want to limit only some part of the route or should have conditional branch for multiple user types,
 *  you can make use of `UserType` parameter decorator and `UserTypeUtil.havePermission()` function instead.
 *
 * @param permissions One or more user types that can access the route
 */
export const AllowedFor = (...permissions: UserTypes[]) => SetMetadata(ALLOWED_FOR_KEY, permissions);

/**
 * Parameter decorator for auth data
 *
 * Decorator returns `IAuthData` object, but it can be `undefined` if the user is not authenticated
 */
export const AuthData = createParamDecorator((data: unknown, context: ExecutionContext): IAuthData | undefined => {
  const request = context.switchToHttp().getRequest<FastifyRequest>();
  return (request.params as ICustomRequestParams).authData;
});

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const token = this.extractAccessTokenFromHeader(request);

    if(!token) {
      // If authorization token is not provided, set user type to public
      (request.params as ICustomRequestParams).userType = UserTypes.PUBLIC;
    } else {
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
          (request.params as ICustomRequestParams).userType = UserTypes.SUPER_ADMIN;
        } else {
          (request.params as ICustomRequestParams).userType = UserTypes.BOOTH_ADMIN;
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
    let isAllowed = true;

    if(allowedFor && allowedFor.length > 0) {
      // Check only if `AllowedFor` decorator is specified and has at least one user type

      isAllowed = false;
      for(const permission of allowedFor) {
        if(UserTypeUtil.havePermission((request.params as ICustomRequestParams).userType, permission)) {
          isAllowed = true;
          break;
        }
      }
    }

    return isAllowed;
  }

  private extractAccessTokenFromHeader(request: FastifyRequest): string | null {
    // Authorization: Bearer <access_token>
    if(!request.headers.authorization) return null;

    const [ type, accessToken ] = request.headers.authorization.split(" ");
    return type === "Bearer" ? accessToken : null;
  }
}
