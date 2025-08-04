import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { getEnv } from "./core/env";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  if (getEnv("DEBUG") === "True") {
    const swaggerConfig = new DocumentBuilder()
      .setTitle("loslc.tech API")
      .setDescription("API documentation for loslc.tech")
      .setVersion("1.0")
      .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("docs", app, swaggerDocument);
  }

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
