import {Controller, Get, Logger, Param, Req, Res, UseGuards} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserEntity} from "../../persistence/entities/user.entity";
import {RootAuthService} from "../../auth/auth.root.service";
import {JwtAuthGuard} from "../../auth/guards/jwt.authguard";
import {User} from "../../decorators/user.decorator";
import {FeatureGuard} from "../../auth/guards/features.authguard";
import {RequireFeatures} from "../../decorators/require-features.decorator";
import {InjectFeature} from "../../decorators/feature-inject.decorator";
import {TokenInfoFeature} from "./features/token:info/token-info.feature";
import {TokenData} from "../../decorators/token-data.decorator";
import {TokenDataType, TokenPayloadType} from "../../auth/TokenPayloadType";
import {TokenRefreshFeature} from "./features/token:refresh/token-refresh.feature";
import {TokenRevokeFeature} from "./features/token:revoke/token-revoke.feature";
import {TokenRevokeSelfFeature} from "./features/token:revoke/token-revoke-self.feature";
import {AuthRevokeParams} from "./auth.types";

@Controller("auth")
export class AuthController{

    private readonly logger = new Logger("AuthController")

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {
    }

    @Get("/")
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures("token:info")
    async token_info(@TokenData() data: TokenDataType, @InjectFeature("token:info") token_info: TokenInfoFeature){
        return token_info.getTokenInfo(data);
    }

    @Get("/refresh")
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures("token:refresh")
    async token_refresh(@Res({passthrough: true}) res, @TokenData() data: TokenDataType, @InjectFeature("token:refresh") token_refresh: TokenRefreshFeature) {
        this.logger.log(`User ${data.user.username} refreshed token.`);
        return token_refresh.renewToken(data, res);
    }

    @Get("/revoke/self")
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures("token:revoke:self")
    async token_revoke_self(@TokenData() data: TokenDataType, @InjectFeature("token:revoke:self") token_revoke: TokenRevokeSelfFeature){
        this.logger.log(`User ${data.user.username} revoked all of its tokens with seq < ${await token_revoke.revoke(data)}.`);
        return {status: true}
    }

    @Get("/revoke/:user_id")
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures("token:revoke")
    async token_revoke(@Param() params: AuthRevokeParams, @User() cur_user, @InjectFeature("token:revoke") token_revoke: TokenRevokeFeature){
        this.logger.log(`User ${cur_user.username} revoked all tokens for user id ${params.user_id} with seq < ${await token_revoke.revoke(params.user_id)}.`);
        return {status: true}
    }

}