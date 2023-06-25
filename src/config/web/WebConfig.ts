import {IsDefined, IsInt, IsNotEmpty, IsString, Max, Min} from "class-validator";

export class WebConfig{
    @IsString()
    @IsDefined()
    public readonly basePath: string = ""

    @IsInt()
    @Min(1)
    @Max(65535)
    @IsNotEmpty()
    public readonly port: number = 3000
}
