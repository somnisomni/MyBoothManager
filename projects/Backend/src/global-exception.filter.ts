import type { FastifyReply, FastifyRequest } from "fastify";
import { IBackendErrorResponse } from "@myboothmanager/common";
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, ImATeapotException, NotFoundException } from "@nestjs/common";

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
    const statusCode = exception instanceof HttpException ? exception.getStatus() : 500;

    response.status(statusCode).send({
      message: exception instanceof HttpException ? exception.message : "Server caused a/some unhandled error(s)",
      timestamp: (new Date()).toISOString(),
      path: request.url,
      statusCode,
    } as IBackendErrorResponse);
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<FastifyReply>();
    const request = context.getRequest<FastifyRequest>();
    const statusCode = exception.getStatus();

    response.status(statusCode).send({
      message: exception.message ?? "HTTP Error",
      timestamp: (new Date()).toISOString(),
      path: request.url,
      statusCode,
    } as IBackendErrorResponse);
  }
}

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<FastifyReply>();
    const request = context.getRequest<FastifyRequest>();
    const statusCode = exception.getStatus();

    response.status(statusCode).send({
      message: SCREAM[Math.floor(Math.random() * SCREAM.length)],
      timestamp: (new Date()).toISOString(),
      path: request.url,
      statusCode,
    } as IBackendErrorResponse);
  }
}

@Catch(ImATeapotException)
export class TeapotExceptionFilter implements ExceptionFilter {
  catch(exception: ImATeapotException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<FastifyReply>();
    const request = context.getRequest<FastifyRequest>();
    const statusCode = exception.getStatus();

    response.status(statusCode).send({
      message: "I'm a teapot! uwu",
      timestamp: (new Date()).toISOString(),
      path: request.url,
      statusCode,
    } as IBackendErrorResponse);
  }
}
