import {
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserPasswordData} from "./enitities/UserPasswordData";
import {Repository} from "typeorm";
import {UserEntity} from "../../../../persistence/entities/user.entity";
import * as process from "process";
import {authPassowrdConfig} from "./config/auth-passowrd.config";
import {AuthPasswordConfig} from "./config/AuthPasswordConfig";
import {RootAuthService} from "../../../../auth/auth.root.service";
import {Response} from "express";
import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";


@Injectable()
export class AuthPasswordService {

    constructor(
        @InjectRepository(UserPasswordData) private readonly userPasswordRepository: Repository<UserPasswordData>,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @Inject(authPassowrdConfig.KEY) private readonly config: AuthPasswordConfig,
        private readonly authService: RootAuthService
    ) {
        if (config.createUser)
            this.userPasswordRepository.findOneBy({user: {isSuperuser: true}})
                .then(superPassword => {
                    if (superPassword) return superPassword;
                    return this.userRepository.findOneBy({isSuperuser: true})
                        .then(superuser => {
                            if (superuser) return superuser
                            return this.userRepository.create({
                                username: "admin",
                                isSuperuser: true
                            }).save()
                        })
                        .then(superuser => {
                            const password = process.env.DMS_BOOTSTRAP_PASSWORD || Math.random().toString(26).substring(2)
                            Logger.log(`Creating user ${superuser.username} with password ${password}`)
                            return this.userPasswordRepository.create({
                                user: superuser,
                                password,
                                forceChange: true
                            }).save()
                        })
                })
    }

    public async validateUser(username: string, password: string): Promise<UserEntity>{
        const user_data = await this.userPasswordRepository.findOne({
            where: {user: {username}}
        })
        if(!user_data) throw new UnauthorizedException("User does not exists or doesn't have local login capabilities")
        if(await user_data.verify(password)) return user_data.user
        throw new UnauthorizedException("Password verification failed")
    }

    public async login(user: UserEntity, res: Response){
        return await this.authService.issueToken(user, await this.getUserFeatures(user), res, {login_type: "password"})
    }

    private async getUserFeatures(user: UserEntity){

        const userPasswordData = await UserPasswordData.findOneBy({userId: user.id})
        if(!userPasswordData) throw new InternalServerErrorException(`Non password data set for user ${user.username}`)

        if(userPasswordData.forceChange) return ["token:info", "token:revoke:self", "auth:changepsw:self"]

        const pth = path.normalize(this.config.featuresFile)
        if(!fs.existsSync(pth) || !fs.statSync(pth).isFile()){
            Logger.error(`Permissions file ${pth} not found. returning empty features`)
            return []
        }
        const feature_data = yaml.load(fs.readFileSync(pth))

        return Array.from(new Set([
            ...(feature_data?.stdFeatures || []),
            ...(feature_data?.users && feature_data?.users[user.username]?.features || []),
            ...((feature_data?.users && feature_data?.users[user.username]?.groups) || []).map(g => feature_data?.groups[g] || []).flat()
        ]))
    }
}