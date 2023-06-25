import {BadRequestException, ForbiddenException, Inject, Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {authConfig} from "../../config/auth/auth.config";
import {Request} from "express";
import {AuthConfig} from "../../config/auth/AuthConfig";
import {TokenDataType, TokenPayloadType} from "../TokenPayloadType";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../../persistence/entities/user.entity";
import {Repository} from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt"){
    constructor(
        @Inject(authConfig.KEY) configs: AuthConfig,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req.cookies["Authentication"],
                ExtractJwt.fromAuthHeaderAsBearerToken()
            ]),
            ...(configs.jwt.verifyOptions),
            secretOrKey: configs.jwt.publicKey || configs.jwt.secret
        });
    }

    async validate(payload: TokenPayloadType & {exp: number}): Promise<TokenDataType> {
        if(!payload.id) throw new BadRequestException("Token does not have use id field")
        if(!payload.features) throw new BadRequestException("Token does not have features")
        const user = await this.userRepository.findOneBy({id: payload.id})
        if(!user) throw new ForbiddenException("User does not exists.")
        if(payload.seq < user.seq) throw new ForbiddenException("Revoked token")
        return {
            user,
            features: payload.features,
            expiry: new Date(payload.exp),
            data: payload.data
        };
    }
}