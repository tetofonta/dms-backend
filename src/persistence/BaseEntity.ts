import { BaseEntity as TypeOrmBaseEntity } from 'typeorm';
import {SaveOptions} from "typeorm/repository/SaveOptions";
import {RemoveOptions} from "typeorm/repository/RemoveOptions";
import {CacheManager} from "./CacheManager";

export class BaseEntity extends TypeOrmBaseEntity {

    async loadRelation<T>(
        relationKey: string,
        shouldLoadMany?: boolean,
    ): Promise<T> {
        if (relationKey.trim().length === 0) {
            throw new Error('Cannot load empty relation.');
        }

        const currentEntity: any = this;
        if(typeof(currentEntity[relationKey]) !== "undefined")
            return currentEntity[relationKey]

        const staticAccessor = this.constructor as any;
        const relationQuery = staticAccessor
            .createQueryBuilder()
            .relation(staticAccessor, relationKey)
            .of(this);

        const relationValue: T = shouldLoadMany
            ? await relationQuery.loadMany()
            : await relationQuery.loadOne();

        currentEntity[relationKey] = relationValue;

        return relationValue;
    }

    static async clearCache(){
        // @ts-ignore
        if(this.dataSource.queryResultCache) {
            // @ts-ignore
            const metadata = this.dataSource.getMetadata(this);
            const cacheManager = CacheManager.getInstance(metadata.tableName)
            // @ts-ignore
            await this.dataSource.queryResultCache.remove(cacheManager.getSubCaches())
            cacheManager.clearSubCaches();
        }
    }

    async clearCache(){
        const staticAccessor = this.constructor as any;
        staticAccessor.clearCache();
    }

    async save(options?: SaveOptions): Promise<this>{
        const ret = await super.save(options)
        await this.clearCache()
        return ret;
    }
    async remove(options?: RemoveOptions): Promise<this>{
        const ret = await super.remove(options)
        await this.clearCache()
        return ret;
    }
    async softRemove(options?: SaveOptions): Promise<this>{
        const ret = await super.softRemove(options)
        await this.clearCache()
        return ret;
    }
    async recover(options?: SaveOptions): Promise<this>{
        const ret = await super.recover(options)
        await this.clearCache()
        return ret;
    }

    async reload(): Promise<void>{
        await this.clearCache()
        await super.reload()
    }

}