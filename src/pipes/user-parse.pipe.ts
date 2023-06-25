import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserEntity} from "../persistence/entities/user.entity";
import {TokenDataType} from "../auth/TokenPayloadType";

@Injectable()
export class UserParsePipe implements PipeTransform {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

    async transform(value: { data?: {raw: boolean}, user: TokenDataType}, metadata: ArgumentMetadata): Promise<TokenDataType | UserEntity> {
        if(value.data?.raw)
            return value.user
        if(!value.user?.user)
            throw new BadRequestException("Invalid user data... how did you get here??")
        return value.user.user
    }
}