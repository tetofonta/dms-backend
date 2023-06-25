import {Injectable} from "@nestjs/common";
import {UserEntity} from "../persistence/entities/user.entity";
import {TokenPayloadType} from "./TokenPayloadType";
import {JwtService} from "@nestjs/jwt";
import {Response} from "express";

@Injectable()
export class RootAuthService{

    constructor(
        private readonly jwtService: JwtService,
    ){
    }

    public async issueToken(user: UserEntity, features: string[] | null, res: Response, data?: any): Promise<{ token: string, refresh_token: string, payload: TokenPayloadType }>{
        const payload: TokenPayloadType = {
            id: user.id,
            isSuperuser: user.isSuperuser,
            features, //todo filter by user permissions
            data,
            seq: user.seq
        }


        const token = this.jwtService.sign(payload)
        const refresh_token = this.jwtService.sign({
            id: user.id,
            isSuperuser: false,
            features: ["token:refresh", "token:info"],
            data: {
                ...data,
                features
            }
        })

        res.cookie('Authentication', token)

        return {token, refresh_token, payload}
    }

}