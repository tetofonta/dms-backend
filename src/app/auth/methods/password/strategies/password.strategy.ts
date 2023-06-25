import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {Injectable} from "@nestjs/common";
import {AuthPasswordService} from "../auth-password.service";
import {TokenDataType} from "../../../../../auth/TokenPayloadType";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local'){
    constructor(private authService: AuthPasswordService) {
        super();
    }

    async validate(username: string, password: string): Promise<TokenDataType> {
        return {
            user: await this.authService.validateUser(username, password),
            features: [],
            expiry: new Date()
        };
    }
}