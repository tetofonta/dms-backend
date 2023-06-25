import {IsDefined, IsNotEmpty, IsUUID} from "class-validator";

export class AuthRevokeParams{
    @IsUUID()
    @IsNotEmpty()
    @IsDefined()
    user_id: string
}