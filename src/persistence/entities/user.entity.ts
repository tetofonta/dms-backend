import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {BaseEntity} from "../BaseEntity";
import {
    getMetadataStorage,
    IsBoolean,
    IsDefined,
    IsIn, IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID
} from "class-validator";
import {JSONSchema} from "class-validator-jsonschema";

@Entity()
export class UserEntity extends BaseEntity{

    @PrimaryGeneratedColumn('uuid')
    @IsUUID()
    @JSONSchema({
        readOnly: true
    })
    public id: string;

    @Column({unique: true})
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    public username: string;

    @Column({default: false})
    @IsBoolean()
    @IsOptional()
    public isSuperuser: boolean

    @Column({default: true})
    @IsBoolean()
    @IsOptional()
    public enabled: boolean

    @Column({default: 0})
    @IsInt()
    @IsOptional()
    public seq: number
}