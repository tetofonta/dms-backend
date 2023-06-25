import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository, TypeOrmModule} from "@nestjs/typeorm";
import {UserPasswordData} from "../../enitities/UserPasswordData";
import {Repository} from "typeorm";
import {UserEntity} from "../../../../../../persistence/entities/user.entity";
import {declareFeature} from "../../../../../../auth/declareFeature";
import {AppFeature} from "../../../../../../auth/AppFeature";
import {TokenDataType} from "../../../../../../auth/TokenPayloadType";

@Injectable()
export class AuthChangePasswordSelfFeature implements AppFeature{

    public get feature_name(){
        return "auth:changepsw:self"
    }

    constructor(
        @InjectRepository(UserPasswordData)
        private readonly userPasswordDataRepository: Repository<UserPasswordData>
    ) {
    }

    public async changePassword(token: TokenDataType, password: string, forceUpdate = false){
        const userData = await this.userPasswordDataRepository.findOneBy({userId: token.user.id});
        if(!userData) throw new NotFoundException("User not found")

        userData.password = password
        userData.forceChange = forceUpdate
        await userData.save();
        return {status: true}
    }

}

export const authChangePasswordSelfFeature = declareFeature(AuthChangePasswordSelfFeature, {imports: [TypeOrmModule.forFeature([UserPasswordData])]})