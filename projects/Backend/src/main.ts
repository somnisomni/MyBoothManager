import type { FastifyPluginCallback } from "fastify";
import { MAX_UPLOAD_FILE_BYTES } from "@myboothmanager/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { ClassSerializerInterceptor } from "@nestjs/common";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { default as fastifyMultipart, type FastifyMultipartOptions } from "@fastify/multipart";
import { default as fastifyHelmet, type FastifyHelmetOptions } from "@fastify/helmet";
import { default as fastifyStatic, type FastifyStaticOptions } from "@fastify/static";
import { default as fastifyCookie, type FastifyCookieOptions } from "@fastify/cookie";
import MBMSequelize from "./db/sequelize";
import { AllExceptionsFilter, RouteNotFoundExceptionFilter } from "./global-exception.filter";
import { LoggingInterceptor } from "./logging.interceptor";
import { RootModule } from "./modules/root.module";
import { UtilService } from "./modules/common/util/util.service";

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
  const app = await NestFactory.create<NestFastifyApplication>(
    RootModule,
    new FastifyAdapter({
      trustProxy: process.env.TRUST_LOCALHOST_PROXY?.toLowerCase() === "true" ? "127.0.0.1" : false,
    }),
  );

  /* *** Fastify plugins *** */
  // Cookie
  await app.register(fastifyCookie as unknown as FastifyPluginCallback<FastifyCookieOptions>, {
    secret: `${(process.env.COOKIE_SECRET || "myboothmanager")}${new Date().getTime() + performance.now()}`,
    algorithm: "sha384",
    parseOptions: {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    },
  });

  // Helmet
  await app.register(fastifyHelmet as unknown as FastifyPluginCallback<FastifyHelmetOptions>, {
    global: true,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: { policy: "require-corp" },
    crossOriginOpenerPolicy: { policy: "same-origin" },
    frameguard: { action: "deny" },
    noSniff: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  });

  // Multipart upload
  await app.register(fastifyMultipart, {
    limits: {
      fileSize: MAX_UPLOAD_FILE_BYTES,
    },
  } as FastifyMultipartOptions);

  // Static file serving for uploads
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

  /* *** Nest.js app globals *** */
  // Global filters
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new RouteNotFoundExceptionFilter(),
  );

  // Global interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  // CORS
  app.enableCors({
    origin: [ process.env.FRONTEND_ADMIN_URL ?? "", process.env.FRONTEND_PUBLIC_URL ?? "" ],
    credentials: true,
  });

  /* *** Start the backend server *** */
  await app.listen(
    process.env.API_SERVER_PORT || 20000,
    process.env.API_SERVER_HOST || "127.0.0.1",
    (error, address) => {
      console.debug(`*** Running in ${process.env.NODE_ENV ?? "(not specified)"} environment ***`);

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
