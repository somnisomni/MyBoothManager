import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { default as fastifyMultipart, FastifyMultipartOptions } from "@fastify/multipart";
// import { fastifyHelmet } from "@fastify/helmet";
import { MAX_UPLOAD_FILE_BYTES } from "@myboothmanager/common";
import { default as fastifyStatic, FastifyStaticOptions } from "@fastify/static";
import { AppModule } from "@/app.module";
import { AllExceptionsFilter, RouteNotFoundExceptionFilter, TeapotExceptionFilter } from "./global-exception.filter";
import MBMSequelize from "./db/sequelize";
import { UtilService } from "./modules/admin/util/util.service";
import { LoggingInterceptor } from "./modules/global/logging/logging.interceptor";

let app: NestFastifyApplication;

async function bootstrap() {
  /* *** dotenv configuration *** */
  (await import("dotenv")).config();

  /* *** DB connection *** */
  if(await MBMSequelize.setup()) {
    console.debug("Database connection set up.");
  } else {
    console.error("Error while setting up database connection! Can't start the server.");
    process.exit(1);
  }

  /* *** NestJS application initialization *** */
  app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      trustProxy: process.env.TRUST_LOCALHOST_PROXY?.toLowerCase() === "true" ? "127.0.0.1" : false,
    }),
  );

  /* *** Fastify plugins *** */
  await app.register(fastifyMultipart, {
    limits: {
      fileSize: MAX_UPLOAD_FILE_BYTES,
    },
  } as FastifyMultipartOptions);
  await app.register(fastifyStatic, {
    root: UtilService.RESOLVED_UPLOAD_PATH || "uploads",
    prefix: "/uploads/",
    etag: true,
    cacheControl: true,
    dotfiles: "ignore",
    serveDotFiles: false,
    index: false,
    immutable: false,
  } as FastifyStaticOptions);

  app.enableCors();

  /* *** Nest.js app globals *** */
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new RouteNotFoundExceptionFilter(),
    new TeapotExceptionFilter(),
  );
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
  );

  /* *** Start the backend server *** */
  await app.listen(
    process.env.API_SERVER_PORT || 31111,
    process.env.API_SERVER_HOST || "127.0.0.1",
    (error, address) => {
      if(error) {
        console.error("*** ❌ API server failed to start! ***");
        console.error(error);
      } else {
        console.info(`*** 🌐 API server is running on ${address} ***\n`);
      }
    },
  );
}

bootstrap();
