import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";

@Injectable()
export class DelayIntercepter implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return next.handle();
  }
}
