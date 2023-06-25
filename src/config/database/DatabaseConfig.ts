import {
    IsBoolean, IsIn,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Max,
    Min,
    ValidateIf,
    ValidateNested
} from "class-validator";
import {Type} from "class-transformer";
import {DatabaseCacheConfig} from "./DatabaseCacheConfig";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
import {TlsOptions} from "tls";

export class DatabaseConfig implements PostgresConnectionOptions {
    readonly applicationName: string = "DMS";
    readonly type = "postgres";

    @IsNotEmpty()
    @ValidateNested()
    @ValidateIf(o => !!o.cache)
    @Type(() => DatabaseCacheConfig)
    readonly cache: DatabaseCacheConfig | boolean = false;

    @IsOptional()
    @IsInt()
    readonly connectTimeoutMS: number;

    @IsString()
    @IsNotEmpty()
    @ValidateIf(o => !o.url)
    readonly database: string;

    @IsBoolean()
    readonly dropSchema: boolean = false;

    @IsString()
    @IsNotEmpty()
    readonly host: string;

    @IsBoolean()
    @IsNotEmpty()
    readonly logging: boolean = false;

    @IsString()
    @IsNotEmpty()
    @ValidateIf(o => !o.url)
    readonly password: string | (() => string) | (() => Promise<string>);

    @IsInt()
    @Min(0)
    @Max(65535)
    @IsNotEmpty()
    readonly port: number;

    @IsIn(["join", "query"])
    @IsOptional()
    readonly relationLoadStrategy: "join" | "query";

    @IsOptional()
    readonly ssl: boolean | TlsOptions;

    @IsBoolean()
    @IsNotEmpty()
    readonly synchronize: boolean = false;

    @IsString()
    @IsNotEmpty()
    @ValidateIf(o => !o.username || !o.password || !o.database)
    readonly url: string;

    @IsBoolean()
    readonly useUTC: boolean = true;

    @IsString()
    @IsNotEmpty()
    @ValidateIf(o => !o.url)
    readonly username: string;

    @IsIn(["pgcrypto", "uuid-ossp"])
    @IsOptional()
    readonly uuidExtension: "pgcrypto" | "uuid-ossp";
}

