import {DynamicModule, Module, ModuleMetadata, Type} from "@nestjs/common";
import {AppFeature} from "./AppFeature";

export function declareFeature(features: Type<AppFeature>[] | Type<AppFeature>, oth: ModuleMetadata = {}): Type<AppFeature>{
    const module = class {}
    const f = [features].flat()

    // @ts-ignore
    f.forEach(f => f.import_module = module)

    Module({
        ...oth,
        providers: [...(oth.providers || []), ...f],
        exports: [...(oth.exports || []), ...f]
    })(module)

    return module as Type<AppFeature>;
}