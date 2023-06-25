import {IsBoolean, IsDefined, IsInt, IsString, Min} from "class-validator";

export class AuthPasswordConfig {

    @IsDefined()
    @IsInt()
    @Min(0)
    hashLength: number = 32

    @IsDefined()
    @IsInt()
    @Min(0)
    memoryCost: number = 1024

    @IsDefined()
    @IsInt()
    @Min(0)
    parallelism: number = 8

    @IsDefined()
    @IsInt()
    @Min(0)
    saltLength: number = 16

    @IsDefined()
    @IsInt()
    @Min(0)
    timeCost: number = 20

    @IsDefined()
    @IsBoolean()
    createUser: boolean = true

    @IsDefined()
    @IsString()
    featuresFile: string = "./permissions"
}