import {IsBoolean, IsEnum, IsOptional, IsString} from "class-validator";
import {VerifyOptions, Algorithm} from "jsonwebtoken";

export class JwtVerifyOptions implements VerifyOptions{

    @IsOptional()
    @IsEnum(["HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "ES256", "ES384", "ES512", "PS256", "PS384", "PS512", "none"], {each: true})
    algorithms?: Algorithm[];

    @IsOptional()
    @IsString()
    audience?: string;

    @IsOptional()
    @IsString({each: true})
    issuer?:string[];

    @IsOptional()
    @IsBoolean()
    ignoreExpiration?: boolean;
}