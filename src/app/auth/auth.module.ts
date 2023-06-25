import {Module} from "@nestjs/common";
import {AuthModule} from "../../auth/auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../../persistence/entities/user.entity";
import {AuthController} from "./auth.controller";
import {TokenInfoFeature} from "./features/token:info/token-info.feature";
import {TokenRefreshFeature} from "./features/token:refresh/token-refresh.feature";
import {TokenRevokeFeature} from "./features/token:revoke/token-revoke.feature";
import {TokenRevokeSelfFeature} from "./features/token:revoke/token-revoke-self.feature";
import {AuthPasswordModule} from "./methods/password/auth-password.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        AuthModule.forRoot(),

        AuthModule.forFeatures(TokenInfoFeature, TokenRefreshFeature, TokenRevokeFeature, TokenRevokeSelfFeature),
        AuthPasswordModule
    ],
    controllers: [AuthController]
})
export class AuthWebModule{}