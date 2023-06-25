import {JwtModuleOptions} from "@nestjs/jwt";
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateIf,
    ValidateNested
} from "class-validator";
import {Type} from "class-transformer";
import {JwtVerifyOptions} from "./JwtVerifyOptions";
import {JwtSignOptions} from "./JwtSignOptions";

export class JwtConfig implements JwtModuleOptions {
    @ValidateIf(o => !o.publicKey && !o.privateKey)
    @IsString()
    @IsNotEmpty()
    readonly secret?: string;

    @IsString()
    @IsOptional()
    publicKey?: string;

    @IsString()
    @IsOptional()
    privateKey?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => JwtVerifyOptions)
    verifyOptions?: JwtVerifyOptions;

    @IsOptional()
    @ValidateNested()
    @Type(() => JwtSignOptions)
    signOptions?: JwtSignOptions;
}