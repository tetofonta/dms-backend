import {SelectQueryBuilder as TypeOrmSelectQueryBuilder} from "typeorm";
import {ReadStream} from "typeorm/platform/PlatformTools";
import {CacheManager} from "./CacheManager";

export class CacheSelectQueryBuilder<Entity> extends TypeOrmSelectQueryBuilder<Entity> {

    constructor(dataSource, queryRunner, private readonly cache_name: CacheManager) {
        super(dataSource, queryRunner);
    }

    getRawOne<T = any>(): Promise<T | undefined> {
        if(this.cache_name) super.cache(this.cache_name.addSubCache(this.getQuery(), this.getParameters()))
        return super.getRawOne()
    }

    getRawMany<T = any>(): Promise<T[]> {
        if(this.cache_name) super.cache(this.cache_name.addSubCache(this.getQuery(), this.getParameters()))
        return super.getRawMany()
    }

    getRawAndEntities<T = any>(): Promise<{
        entities: Entity[];
        raw: T[];
    }> {
        if(this.cache_name) super.cache(this.cache_name.addSubCache(this.getQuery(), this.getParameters()))
        return super.getRawAndEntities()
    }

    getOne(): Promise<Entity | null> {
        return super.getOne()
    }

    getOneOrFail(): Promise<Entity> {
        return super.getOneOrFail()
    }

    getMany(): Promise<Entity[]> {
        return super.getMany()
    }

    getCount(): Promise<number> {
        return super.getCount()
    }

    getExists(): Promise<boolean> {
        return super.getExists()
    }

    getManyAndCount(): Promise<[Entity[], number]> {
        return super.getManyAndCount()
    }

    stream(): Promise<ReadStream> {
        return super.stream()
    }

}