import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {UserParsePipe} from "../pipes/user-parse.pipe";
import {FeatureInjectPipe} from "../pipes/feature-inject.pipe";

const FeatureRaw = createParamDecorator(
    (data?: string, ctx?: ExecutionContext) => {
        return {
            features: ctx.switchToHttp().getRequest().user.features,
            user: ctx.switchToHttp().getRequest().user.user,
            wanted: data,
            context: ctx
        };
    },
);

export const InjectFeature = (data?: string) => FeatureRaw(data, FeatureInjectPipe)