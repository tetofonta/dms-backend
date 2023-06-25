import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {AppFeature} from "../../../../auth/AppFeature";
import {TokenInfoResponse} from "./token-info.types";
import {TokenDataType} from "../../../../auth/TokenPayloadType";
import {declareFeature} from "../../../../auth/declareFeature";

@Injectable()
export class TokenInfoFeature implements AppFeature {
    public get feature_name(): string{
        return "token:info"
    };

    public async getTokenInfo(data: TokenDataType): Promise<TokenInfoResponse>{
        return {
            user: data.user,
            data: data.data,
            features: data.features
        }
    }
}

export const tokenInfoFeature = declareFeature(TokenInfoFeature);