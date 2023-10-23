import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
// import { fastifyHelmet } from "@fastify/helmet";
import { AppModule } from "@/app.module";
import { HttpExceptionFilter, NotFoundExceptionFilter, TeapotExceptionFilter } from "./global-exception.filter";
import MBMSequelize from "./db/sequelize";
import { insertTempDataIntoDB } from "./dev/temp-data";

let app: NestFastifyApplication;

async function dev() {
  if(process.env.NODE_ENV === "development") {
    console.debug("dev env");

    // await app.register(fastifyHelmet, {
    //   crossOriginResourcePolicy: false,
    //   contentSecurityPolicy: false,
    // });

    if(MBMSequelize.instance) {
      await insertTempDataIntoDB();
    }
  }
}

async function bootstrap() {
  /* dotenv configuration */
  (await import("dotenv")).config();

  /* DB connection */
  if(await MBMSequelize.setup()) {
    console.debug("Database connection set up.");
  } else {
    console.error("Error while setting up database connection! Can't start the server.");
    process.exit(1);
  }

  /* NestJS application */
  app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // dev
  if(process.env.NODE_ENV === "development") await dev();

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new NotFoundExceptionFilter(),
    new TeapotExceptionFilter(),
  );

  app.enableCors();

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
