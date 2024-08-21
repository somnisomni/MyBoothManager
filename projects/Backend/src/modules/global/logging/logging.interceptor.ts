import type { FastifyRequest } from "fastify";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import chalk from "chalk";
import { AppController } from "@/app.controller";

const logFn = (symb: string, now: string, msg: string, handleStartTimestamp: number) => chalk`${symb} {gray [${now}]} ${msg} {dim.italic (took ${(performance.now() - handleStartTimestamp).toFixed(2)}ms)}`;

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const contextClass = context.getClass();
    const contextHandler = context.getHandler();
    const contextHttp = context.switchToHttp().getRequest<FastifyRequest>();
    const ip = contextHttp.ips ? contextHttp.ips[contextHttp.ips.length - 1] : contextHttp.ip;
    const nowStr = (new Date()).toISOString();
    const preciseNow = performance.now();

    if(contextClass === AppController && contextHandler === AppController.prototype.healthCheck) {
      return next.handle().pipe(tap({
        finalize: () => {
          console.log(logFn("🔄", nowStr, chalk`health check from {bold ${ip}}`, preciseNow));
          console.log();
        },
      }));
    }

    return next.handle().pipe(tap({
      next: () => {
        console.log(logFn("✅", nowStr, chalk`request from {bold ${ip}}`, preciseNow));
        console.log(chalk` └ path: {bold ${contextHttp.method}} ${contextHttp.url}`);
        console.debug(chalk` └ context: {underline ${contextClass.name}}{dim.italic .${contextHandler.name}}`);
      },
      error: (error) => {
        console.error(logFn("❌", nowStr, chalk`request from {bold ${ip}}`, preciseNow));
        console.error(chalk` └ path: {bold ${contextHttp.method}} ${contextHttp.url}`);
        console.debug(chalk` └ context: {underline ${contextClass.name}}{dim.italic .${contextHandler.name}}`);
        console.error(chalk` └ failed with error: {bold.red ${error}}`);
      },
      finalize: () => console.log(),
    }));
  }
}
