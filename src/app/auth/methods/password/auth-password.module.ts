import {Module} from "@nestjs/common";
import {AuthPasswordController} from "./auth-password.controller";
import {AuthPasswordService} from "./auth-password.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserPasswordData} from "./enitities/UserPasswordData";
import {AuthModule} from "../../../../auth/auth.module";
import {UserEntity} from "../../../../persistence/entities/user.entity";
import {ConfigModule} from "@nestjs/config";
import {authPassowrdConfig} from "./config/auth-passowrd.config";
import {LocalStrategy} from "./strategies/password.strategy";
import {UserPasswordDataSubscriber} from "./subscribers/UserPasswordData.subscriber";
import {AuthChangePasswordSelfFeature} from "./features/auth:changepsw:self/auth-change-password-self.feature";

@Module({
    controllers: [AuthPasswordController],
    providers: [AuthPasswordService, LocalStrategy, UserPasswordDataSubscriber],
    imports: [
        ConfigModule.forFeature(authPassowrdConfig),
        TypeOrmModule.forFeature([UserPasswordData, UserEntity]),
        AuthModule.forRoot(),
        AuthModule.forFeatures(AuthChangePasswordSelfFeature)
    ]
})
export class AuthPasswordModule{}