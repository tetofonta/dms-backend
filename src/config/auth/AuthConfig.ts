import {IsNotEmpty, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {JwtConfig} from "./JwtConfig";

export class AuthConfig {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => JwtConfig)
    readonly jwt: JwtConfig;
}