import {NestFactory} from '@nestjs/core';
import {AppModule} from './app/app.module';
import 'reflect-metadata';
import {getLogLevels} from "./utils";
import * as process from "process";
import {ConfigModule} from "@nestjs/config";
import * as path from "path";
import {ValidationPipe} from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import {webConfig} from "./config/web/web.config";
import {WebConfig} from "./config/web/WebConfig";

(async function () {

    const app = await NestFactory.create(AppModule, {
        logger: getLogLevels(process.env.DMS_LOG_LEVEL || "INFO")
    });

    const generalConfigs: WebConfig = app.get(webConfig.KEY)
    app.setGlobalPrefix(path.join(generalConfigs.basePath, "api"))
    app.useGlobalPipes(new ValidationPipe({
        transform: true
    }));
    app.use(cookieParser());
    await app.listen(generalConfigs.port);
})()