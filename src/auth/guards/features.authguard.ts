import {AuthGuard} from "@nestjs/passport";
import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Observable} from "rxjs";
import {Reflector} from "@nestjs/core";

@Injectable()
export class FeatureGuard implements CanActivate{

    constructor(private readonly reflector: Reflector) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const features = this.reflector.get<string[]>('features', context.getHandler());
        const r = context.switchToHttp().getRequest();
        return r.user.user.isSuperuser || features.every(f => r.user.features.includes(f));
    }

}