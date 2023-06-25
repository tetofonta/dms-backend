import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import {databaseConfig} from "../config/database/database.config";
import {DatabaseConfig} from "../config/database/DatabaseConfig";
import {UserEntity} from "./entities/user.entity";
import {DataSource, DataSourceOptions} from "typeorm";
import {CacheDataSource} from "./DataSource";
import {UserPasswordData} from "../app/auth/methods/password/enitities/UserPasswordData";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            dataSourceFactory: async (options?: DataSourceOptions) => {
                if(options.cache) return new CacheDataSource(options)
                else return new DataSource(options)
            },
            imports: [ConfigModule.forFeature(databaseConfig)],
            inject: [databaseConfig.KEY],
            useFactory: (dbConfig: DatabaseConfig) => {
                const ret = Object.assign(dbConfig, {
                    entities: [
                        UserEntity,
                        UserPasswordData
                    ]
                })
                return ret
            }
        })
    ]
})
export class DatabaseModule {

}