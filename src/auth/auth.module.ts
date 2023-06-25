import {DynamicModule, Module, Type} from "@nestjs/common";
import {AppFeature} from "./AppFeature";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {RootAuthService} from "./auth.root.service";
import {AuthService} from "./auth.service";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule} from "@nestjs/config";
import {authConfig} from "../config/auth/auth.config";
import {AuthConfig} from "../config/auth/AuthConfig";
import {PassportModule} from "@nestjs/passport";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../persistence/entities/user.entity";

@Module({})
export class AuthModule {
    static forFeatures(...features: Type<AppFeature>[]): DynamicModule {
        return {
            module: AuthModule,
            providers: [
                JwtStrategy,
                AuthService,
                {
                    provide: "FEATURES",
                    inject: features,
                    useFactory: (...args) => args.reduce((o: any, f: AppFeature) => Object.assign(o, {[f.feature_name]: f}), {})
                }
            ],
            imports: [
                PassportModule,
                ConfigModule.forFeature(authConfig),
                TypeOrmModule.forFeature([UserEntity]),
                ...features.map((e: any) => e.import_module)
            ],
            exports: [AuthService]
        }
    }

    static forRoot() {
        return {
            module: AuthModule,
            providers: [RootAuthService],
            exports: [RootAuthService],
            imports: [
                JwtModule.registerAsync({
                    imports: [ConfigModule.forFeature(authConfig)],
                    inject: [authConfig.KEY],
                    useFactory: (config: AuthConfig) => config.jwt
                })
            ]
        }
    }
}