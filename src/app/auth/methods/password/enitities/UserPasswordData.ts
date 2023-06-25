import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from "typeorm";
import {UserEntity} from "../../../../../persistence/entities/user.entity";
import {BaseEntity} from "../../../../../persistence/BaseEntity";
import * as argon2 from "argon2";
@Entity()
export class UserPasswordData extends BaseEntity{
    @PrimaryColumn('uuid')
    public userId: string

    @OneToOne(() => UserEntity)
    @JoinColumn({name: "userId"})
    public user: UserEntity

    @Column()
    public password: string

    @Column({type: 'timestamp', nullable: true})
    public lastChange?: Date

    @Column({default: false})
    public forceChange: boolean

    public async verify(password: string){
        await this.loadRelation("user");
        if(!this.user.enabled) return false
        try{
            return await argon2.verify(this.password, password)
        } catch (e) {
            return false
        }
    }
}