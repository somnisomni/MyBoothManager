import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "@/app.module";
import { HttpExceptionFilter, NotFoundExceptionFilter, TeapotExceptionFilter } from "./global-exception.filter";

async function bootstrap() {
  (await import("dotenv")).config();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new NotFoundExceptionFilter(),
    new TeapotExceptionFilter(),
  );

  await app.listen(
    process.env.API_SERVER_PORT || 31111,
    process.env.API_SERVER_HOST || "127.0.0.1",
    (error, address) => {
      if(error) {
        console.error("API server failed to start!");
        console.error(error);
      } else {
        console.info(`API server is running on ${address}`);
      }
    },
  );
}

bootstrap();
