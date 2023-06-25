import {BadRequestException, Injectable, InternalServerErrorException} from "@nestjs/common";
import {AppFeature} from "../../../../auth/AppFeature";
import {TokenDataType} from "../../../../auth/TokenPayloadType";
import {RootAuthService} from "../../../../auth/auth.root.service";
import {UserEntity} from "../../../../persistence/entities/user.entity";
import {Response} from "express";
import {AuthModule} from "../../../../auth/auth.module";
import {declareFeature} from "../../../../auth/declareFeature";
import {TokenInfoFeature} from "../token:info/token-info.feature";

@Injectable()
export class TokenRefreshFeature implements AppFeature {
    public get feature_name(): string {
        return "token:refresh"
    };

    constructor(
        private readonly authService: RootAuthService
    ) {
    }

    public async renewToken(refresh_token_data: TokenDataType, res: Response){
        if(!refresh_token_data.data?.features) throw new BadRequestException("Refresh token does not include refreshing features")
        return this.authService.issueToken(refresh_token_data.user, refresh_token_data.data.features, res, {...refresh_token_data.data, features: undefined});
    }
}

export const tokenRefreshFeature = declareFeature(TokenRefreshFeature, {imports: [AuthModule.forRoot()]});
