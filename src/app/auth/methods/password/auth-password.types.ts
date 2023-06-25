import {IsDefined, IsNotEmpty, IsString, IsUUID, MinLength} from "class-validator";

export class AuthPasswordChangeBody{
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string
}

export class AuthPasswordResetParams {
    @IsUUID()
    @IsNotEmpty()
    @IsDefined()
    user_id: string
}