import {DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent} from "typeorm";
import {Inject} from "@nestjs/common";
import {authPassowrdConfig} from "../config/auth-passowrd.config";
import {AuthPasswordConfig} from "../config/AuthPasswordConfig";
import {UserPasswordData} from "../enitities/UserPasswordData";
import * as argon2 from "argon2";

@EventSubscriber()
export class UserPasswordDataSubscriber implements EntitySubscriberInterface<UserPasswordData> {
    constructor(
        @Inject(authPassowrdConfig.KEY) private readonly config: AuthPasswordConfig,
        dataSource: DataSource
    ) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return UserPasswordData;
    }

    async beforeInsert(event: InsertEvent<UserPasswordData>) {
        await this.updatePassword(event.entity);
    }

    async beforeUpdate(event: UpdateEvent<UserPasswordData>): Promise<any> {
        if(event.updatedColumns.some(e => e.propertyName === "password"))
            await this.updatePassword(event.entity as UserPasswordData)
    }

    private async updatePassword(entity: UserPasswordData){
        entity.password = await argon2.hash(entity.password, {
            hashLength: this.config.hashLength,
            memoryCost: this.config.memoryCost,
            parallelism: this.config.parallelism,
            saltLength: this.config.saltLength,
            timeCost: this.config.timeCost,
            type: argon2.argon2id,
        })
        return entity
    }
}