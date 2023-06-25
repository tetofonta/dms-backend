import {
    DataSource,
    EntityTarget,
    InstanceChecker,
    ObjectLiteral,
    QueryRunner,
    SelectQueryBuilder,
    TypeORMError
} from "typeorm";
import {DataSourceOptions} from "typeorm/data-source/DataSourceOptions";
import {CacheSelectQueryBuilder} from "./QueryBuilder";
import {DriverUtils} from "typeorm/driver/DriverUtils";
import {CacheManager} from "./CacheManager";

export class CacheDataSource extends DataSource {

    constructor(options: DataSourceOptions) {
        super(options);
    }

    public createQueryBuilder<Entity extends ObjectLiteral>(entityClass: EntityTarget<Entity> | QueryRunner, alias?: string, queryRunner?: QueryRunner): SelectQueryBuilder<Entity>{
        // try{
        //     const metadata = this.getMetadata(entityClass);
        //     console.log("Caching", metadata.tableName, alias, queryRunner);
        //     return super.createQueryBuilder(entityClass, alias, queryRunner);
        // } catch (e) {
        //     return super.createQueryBuilder(entityClass, alias, queryRunner);
        // }

        /*
        if (InstanceChecker_1.InstanceChecker.isMongoEntityManager(this.manager))
            throw new error_1.TypeORMError(`Query Builder is not supported by MongoDB.`);
        if (alias) {
            alias = DriverUtils_1.DriverUtils.buildAlias(this.driver, undefined, alias);
            const metadata = this.getMetadata(entityOrRunner);
            return new SelectQueryBuilder_1.SelectQueryBuilder(this, queryRunner)
                .select(alias)
                .from(metadata.target, alias);
        }
        else {
            return new SelectQueryBuilder_1.SelectQueryBuilder(this, entityOrRunner);
        }

         */
        if(InstanceChecker.isMongoEntityManager(this.manager)) throw new TypeORMError(`Query Builder is not supported by MongoDB.`);
        if(alias){
            alias = DriverUtils.buildAlias(this.driver, undefined, alias);
            const metadata = this.getMetadata(entityClass as EntityTarget<Entity>);
            return new CacheSelectQueryBuilder(this, queryRunner, CacheManager.getInstance(metadata.tableName)).select(alias).from(metadata.target, alias);
        }
        return new CacheSelectQueryBuilder(this, entityClass as QueryRunner, undefined);
    }

}