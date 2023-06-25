import {UserEntity} from "../../../../persistence/entities/user.entity";

export interface TokenInfoResponse{
    user: UserEntity,
    data: any,
    features: string[]
}