import {getMetadataStorage, ValidationError} from "class-validator";
import {LogLevel} from "@nestjs/common";
import {BaseEntity} from "./persistence/BaseEntity";
import {validationMetadataArrayToSchemas} from "class-validator-jsonschema";

export function deepAssign<T, U>(src: T, dst: U): T & U {

    Object.keys(dst).forEach(k => {
        if (!src[k] || typeof (src[k]) !== "object") return Object.assign(src, {[k]: dst[k]})
        src[k] = deepAssign(src[k], dst[k]);
    })

    return src as T & U;
}

export function deflatten(def: string[], value: string): any {
    if (def.length == 0) return value;
    return {[def[0]]: deflatten(def.slice(1), value)}
}

const LOG_LEVELS: {template: LogLevel[], [k: string]: any} = {
    DEBUG: 0,
    VERBOSE: 1,
    INFO: 2,
    WARNING: 3,
    ERROR: 4,
    NONE: 5,
    template: ["debug", "verbose", "log", "warn", "error"]
}

export function getLogLevels(log_level): LogLevel[] {
    if (typeof (LOG_LEVELS[log_level]) == 'undefined') return getLogLevels("INFO")

    const lev = LOG_LEVELS[log_level]
    return LOG_LEVELS.template.splice(lev, 5 - lev)
}

export function validationErrorToString(errors: ValidationError[], indent = 0) {

    return errors.map(e =>
        Array(indent).fill('\t').join("") +
        `In ${e.target.constructor.name}, property ${e.property} (with value ${e.value}) violates constrains:\n` +
        Array(indent + 1).fill('\t').join("") +
        Object.keys(e.constraints || {}).map(c => e.constraints[c]).join("\n" + Array(indent + 1).fill('\t').join("")) + "\n" +
        validationErrorToString(e.children, indent + 2)
    ).join("\n")

}

export function classToSchema(clazz: any){
    return validationMetadataArrayToSchemas((getMetadataStorage() as any).validationMetadatas.get(clazz), {})
}