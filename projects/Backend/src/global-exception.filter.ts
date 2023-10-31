import type { FastifyReply, FastifyRequest } from "fastify";
import { ErrorCodes, IBackendErrorResponse } from "@myboothmanager/common";
import { ArgumentsHost, Catch, ExceptionFilter, ImATeapotException as Nest__ImATeapotException, NotFoundException as Nest__NotFoundException } from "@nestjs/common";
import BaseHttpException, { ApplicationUncaughtedException } from "./lib/exceptions/base";

const SCREAM = [
  "FIND YOUR RIGHT WAY",
  "NOT HEREE",
  "YOU SHOULD STAY AWAY FROM HEREEE",
  "NOOOOO! I WON'T GIVE YOU ANYTHINGGGG",
  "NOOOOO! I WON'T GIVE YOU ANY INFORMATIONNNNN",
  "YOU ARE NOT WELCOME HEREEEEEE",
  "GO AWAYYYYYYY",
  "STAY AWAY FROM HEREEEEEEEE",
  "PLEASE DON'T HACK MEEEEEEEEE",
  "IT'S NOT MY FAULT! IT'S YOUR FAULTTTTTTTTTT",
  "https://www.youtube.com/watch?v=JRHARtLZLk8",
];

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<FastifyReply>();
    const request = context.getRequest<FastifyRequest>();
    const exc = exception instanceof BaseHttpException ? exception : new ApplicationUncaughtedException();
    const statusCode = exc.getStatus();

    response.status(statusCode).send({
      ...exc.getResponse(),
      path: request.url,
    } as IBackendErrorResponse);
  }
}

// @Catch(HttpException)
// export class HttpExceptionFilter implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const context = host.switchToHttp();
//     const response = context.getResponse<FastifyReply>();
//     const request = context.getRequest<FastifyRequest>();
//     const statusCode = exception.getStatus();

//     response.status(statusCode).send({
//       ...exception.getResponse() as object,
//       error: undefined,
//       message: exception.message ?? "HTTP Error",
//       timestamp: (new Date()).toISOString(),
//       path: request.url,
//       statusCode,
//       errorCode: ErrorCodes.UNKNOWN_ERROR,
//     } as IBackendErrorResponse);
//   }
// }

@Catch(Nest__NotFoundException)
export class RouteNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: Nest__NotFoundException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<FastifyReply>();
    const request = context.getRequest<FastifyRequest>();
    const statusCode = exception.getStatus();

    response.status(statusCode).send({
      ...new BaseHttpException(ErrorCodes.ROUTE_NOT_FOUND, statusCode).getResponse(),
      path: request.url,
    } as IBackendErrorResponse);
  }
}

@Catch(Nest__ImATeapotException)
export class TeapotExceptionFilter implements ExceptionFilter {
  catch(exception: Nest__ImATeapotException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<FastifyReply>();
    const request = context.getRequest<FastifyRequest>();
    const statusCode = exception.getStatus();

    response.status(statusCode).send({
      message: "I'm a teapot! uwu",
      timestamp: (new Date()).toISOString(),
      path: request.url,
      statusCode,
      errorCode: ErrorCodes.SUCCESS,
    } as IBackendErrorResponse);
  }
}
