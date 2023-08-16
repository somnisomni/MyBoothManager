import { AddressInfo } from "node:net";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "@/app.module";

async function bootstrap() {
  (await import("dotenv")).config();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.listen(
    process.env.API_SERVER_PORT || 31111,
    process.env.API_SERVER_HOST || "127.0.0.1",
  );

  if(app.getHttpServer().listening) {
    const addressInfo = app.getHttpServer().address() as AddressInfo;
    console.info(`API server is running on http://${addressInfo.address}:${addressInfo.port}`);
  } else {
    console.error("API server failed to start!");
  }
}

bootstrap();
