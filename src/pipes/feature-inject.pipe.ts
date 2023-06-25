import {
    ArgumentMetadata, BadRequestException,
    ExecutionContext, ForbiddenException,
    Injectable, InternalServerErrorException,
    Logger,
    PipeTransform
} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {AuthService} from "../auth/auth.service";
import {UserEntity} from "../persistence/entities/user.entity";

@Injectable()
export class FeatureInjectPipe implements PipeTransform {
    constructor(
        private readonly authService: AuthService,
        private readonly reflector: Reflector
    ) {}

    async transform(value: { wanted: string, features: string[], context: ExecutionContext, user: UserEntity }, metadata: ArgumentMetadata) {

        if(value.wanted){
            const features = this.reflector.get<string[]>('features', value.context.getHandler());
            if(!features.includes(value.wanted)) Logger.warn(`The feature "${value.wanted}" has not been explicitly requested.`)
        }

        if(value.wanted && !value.features.includes(value.wanted) && !value.user.isSuperuser) {
            Logger.warn(`User ${value.user.username} access refused because ${value.wanted} is not in its permission set.`)
            throw new ForbiddenException("User does not have enough permissions")
        }
        const populated_features = await this.authService.populate_features(value.wanted ? [value.wanted] : value.features)

        if(value.wanted) {
            if(!populated_features[value.wanted]) throw new InternalServerErrorException(`feature ${value.wanted} not found in the controller namespace`)
            return populated_features[value.wanted]
        }

        return populated_features;
    }
}