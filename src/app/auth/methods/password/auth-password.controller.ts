import {Body, Controller, HttpCode, Param, Patch, Post, Res, UseGuards} from "@nestjs/common";
import {AuthPasswordService} from "./auth-password.service";
import {LocalAuthGuard} from "./guards/password.guard";
import {User} from "../../../../decorators/user.decorator";
import {UserEntity} from "../../../../persistence/entities/user.entity";
import {JwtAuthGuard} from "../../../../auth/guards/jwt.authguard";
import {FeatureGuard} from "../../../../auth/guards/features.authguard";
import {RequireFeatures} from "../../../../decorators/require-features.decorator";
import {AuthPasswordChangeBody, AuthPasswordResetParams} from "./auth-password.types";
import {InjectFeature} from "../../../../decorators/feature-inject.decorator";
import {AuthChangePasswordSelfFeature} from "./features/auth:changepsw:self/auth-change-password-self.feature";
import {TokenData} from "../../../../decorators/token-data.decorator";
import {TokenDataType} from "../../../../auth/TokenPayloadType";
import {AuthPasswordResetFeature} from "./features/auth:resetpsw/auth-password-reset.feature";

@Controller("auth/password")
export class AuthPasswordController{

    constructor(
        private readonly service: AuthPasswordService
    ) {
    }

    @Post("/login")
    @HttpCode(200)
    @UseGuards(LocalAuthGuard)
    async login(@User() user: UserEntity, @Res({passthrough: true}) res){
        return await this.service.login(user, res);
    }

    @Patch("/")
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures("auth:changepsw:self")
    async changeUserPassword(@TokenData() token: TokenDataType, @Body() body: AuthPasswordChangeBody,  @InjectFeature("auth:changepsw:self") chpsw: AuthChangePasswordSelfFeature){
        return await chpsw.changePassword(token, body.password);
    }

    @Patch("/:user_id")
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures("auth:resetpsw")
    async resetUserPassword(@User() user: UserEntity, @Param() params: AuthPasswordResetParams, @InjectFeature("auth:resetpsw") resetpsw: AuthPasswordResetFeature){
        return await resetpsw.resetPassword(user);
    }

}