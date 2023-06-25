import {IsBoolean, IsEnum, IsOptional, IsString} from "class-validator";
import {Algorithm, SignOptions} from "jsonwebtoken";

export class JwtSignOptions implements SignOptions{

    @IsOptional()
    @IsEnum(["HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "ES256", "ES384", "ES512", "PS256", "PS384", "PS512", "none"])
    algorithm?: Algorithm;

    @IsOptional()
    @IsString()
    keyid?: string;

    @IsOptional()
    @IsString()
    expiresIn?: string;

    @IsOptional()
    @IsString()
    notBefore?: string;

    @IsOptional()
    @IsString({each: true})
    audience?: string[];

    @IsOptional()
    @IsString()
    subject?: string;

    @IsOptional()
    @IsString()
    issuer?: string;

    @IsOptional()
    @IsString()
    jwtid?: string;

    @IsOptional()
    @IsBoolean()
    mutatePayload?: boolean;

    @IsOptional()
    @IsBoolean()
    noTimestamp?: boolean;

    @IsOptional()
    @IsString()
    encoding?: string;
    @IsOptional()
    @IsBoolean()
    allowInsecureKeySizes?: boolean;
    @IsOptional()
    @IsBoolean()
    allowInvalidAsymmetricKeyTypes?: boolean;
}
