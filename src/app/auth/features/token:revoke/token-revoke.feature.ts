import {BadRequestException, Injectable, ModuleMetadata, NotFoundException, Type} from "@nestjs/common";
import {AppFeature} from "../../../../auth/AppFeature";
import {UserEntity} from "../../../../persistence/entities/user.entity";
import {InjectRepository, TypeOrmModule} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {declareFeature} from "../../../../auth/declareFeature";

@Injectable()
export class TokenRevokeFeature implements AppFeature {
    public get feature_name(): string {
        return "token:revoke"
    };

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {
    }

    public async revoke(user: UserEntity): Promise<number>;
    public async revoke(user_id: string): Promise<number>;

    public async revoke(user: string | UserEntity): Promise<number>{
        if(typeof user == "string"){
            if(!user) throw new BadRequestException("Invalid user id")
            const user_entity = await this.userRepository.findOneBy({id: user})
            if(!user_entity) throw new NotFoundException(`No user found with id ${user}`)
            return await this.revokeUser(user_entity);
        }
        return await this.revokeUser(user);
    }


    private async revokeUser(user: UserEntity): Promise<number>{
        user.seq += 1;
        await user.save();
        return user.seq;
    }
}



export const tokenRevokeFeature = declareFeature(TokenRevokeFeature, {imports: [TypeOrmModule.forFeature([UserEntity])]})