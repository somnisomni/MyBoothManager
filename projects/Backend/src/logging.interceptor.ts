import type { FastifyRequest } from "fastify";
import { Observable, tap } from "rxjs";
import chalk from "chalk";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { RootController } from "./modules/root.controller";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // Record the start time of the request
    const handleStartTimestamp = performance.now();
    const handleStartDate = new Date();

    // Context information
    const contextClass = context.getClass();
    const contextHandler = context.getHandler();
    const contextHttp = context.switchToHttp().getRequest<FastifyRequest>();
    const ip = contextHttp.ips ? contextHttp.ips[contextHttp.ips.length - 1] : contextHttp.ip;

    // Log header message generator function
    function generateLogHeader(symbol: string, message: string) {
      const handleEndTimestamp = performance.now();
      const elapsed = handleEndTimestamp - handleStartTimestamp;

      return chalk`${symbol} `
          + chalk`{gray [${handleStartDate.toISOString()}]} `
          + chalk`${message} `
          + chalk`{dim.italic (took ${elapsed.toFixed(2)}ms)}`;
    }

    // Special logging for health check requests
    if(contextHandler === RootController.prototype.healthCheck) {
      return next.handle().pipe(tap({
        finalize: () => {
          console.log(generateLogHeader("🔄", chalk`health check from {bold ${ip}}`));
          console.log();
        },
      }));
    }

    // Normal request logging
    return next.handle().pipe(tap({
      next: () => {
        console.log(generateLogHeader("✅", chalk`request from {bold ${ip}}`));
        console.log(chalk` └ path: {bold ${contextHttp.method}} ${contextHttp.url}`);
        console.debug(chalk` └ context: {underline ${contextClass.name}}{dim.italic .${contextHandler.name}}`);
      },
      error: (error) => {
        console.error(generateLogHeader("❌", chalk`request from {bold ${ip}}`));
        console.error(chalk` └ path: {bold ${contextHttp.method}} ${contextHttp.url}`);
        console.debug(chalk` └ context: {underline ${contextClass.name}}{dim.italic .${contextHandler.name}}`);
        console.error(chalk` └ failed with error: {bold.red ${error}}`);
      },
      finalize: () => console.log(),
    }));
  }
}
