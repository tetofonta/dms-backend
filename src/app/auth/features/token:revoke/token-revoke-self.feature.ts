import {Injectable, ModuleMetadata, Type} from "@nestjs/common";
import {AppFeature} from "../../../../auth/AppFeature";
import {TokenDataType} from "../../../../auth/TokenPayloadType";
import {tokenRevokeFeature, TokenRevokeFeature} from "./token-revoke.feature";
import {declareFeature} from "../../../../auth/declareFeature";

@Injectable()
export class TokenRevokeSelfFeature implements AppFeature {
    public get feature_name(): string {
        return "token:revoke:self"
    };

    constructor(
        private readonly revokeFeature: TokenRevokeFeature
    ) {
    }

    public revoke(data: TokenDataType): Promise<number>{
        return this.revokeFeature.revoke(data.user)
    }

}

export const tokenRevokeSelfFeature = declareFeature(TokenRevokeSelfFeature, {imports: [tokenRevokeFeature]})