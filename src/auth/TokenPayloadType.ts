import {UserEntity} from "../persistence/entities/user.entity";

export interface TokenPayloadType {
    id: string,
    isSuperuser: boolean,
    features: string[],
    data?: any,
    seq: number
}

export interface TokenDataType{
    user: UserEntity,
    features: string[],
    data?: any,
    expiry: Date,
}