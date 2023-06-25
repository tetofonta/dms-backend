import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository, TypeOrmModule} from "@nestjs/typeorm";
import {UserPasswordData} from "../../enitities/UserPasswordData";
import {Repository} from "typeorm";
import {UserEntity} from "../../../../../../persistence/entities/user.entity";
import {declareFeature} from "../../../../../../auth/declareFeature";
import {AppFeature} from "../../../../../../auth/AppFeature";
import {AuthChangePasswordSelfFeature} from "../auth:changepsw:self/auth-change-password-self.feature";

@Injectable()
export class AuthPasswordResetFeature implements AppFeature{

    public get feature_name(){
        return "auth:resetpsw"
    }

    constructor(
        @InjectRepository(UserPasswordData)
        private readonly userPasswordDataRepository: Repository<UserPasswordData>
    ) {
    }

    public async resetPassword(user: UserEntity){
        const userData = await this.userPasswordDataRepository.findOneBy({userId: user.id});
        if(!userData) throw new NotFoundException("User not found")

        const password = Math.random().toString(26).substring(2)
        userData.password = password
        userData.forceChange = true
        await userData.save();
        return {password, forceChange: true}
    }

}

export const authPasswordResetFeature = declareFeature(AuthPasswordResetFeature, {imports: [TypeOrmModule.forFeature([UserPasswordData])]})