import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {UserParsePipe} from "../pipes/user-parse.pipe";

const UserRaw = createParamDecorator(
    (data?: {raw?: boolean, groups?: boolean}, ctx?: ExecutionContext) => {
        return {
            user: ctx.switchToHttp().getRequest().user,
            data
        };
    },
);

export const User = (data?: {raw?: boolean}) => UserRaw(data, UserParsePipe)