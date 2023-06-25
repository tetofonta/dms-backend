import {ClassConstructor, plainToInstance} from "class-transformer";
import {ConfigFactoryKeyHost} from "@nestjs/config/dist/utils/register-as.util";
import {registerAs} from "@nestjs/config";
import {Logger, ValidationError} from "@nestjs/common";
import * as process from "process";
import * as fs from "fs";
import * as yaml from "js-yaml";
import * as path from "path";
import {deepAssign, deflatten, validationErrorToString} from "../utils";
import {validate} from "class-validator";
import {
    SETTINGS_ENV_CONFIG_DIR_VARIABLE_NAME,
    SETTINGS_ENV_CONFIG_FILE_VARIABLE_NAME, SETTINGS_ENV_SEPARATOR,
    SETTINGS_GENERIC_NAMESCPACE_ENV_PREFIX, SETTINGS_GENERIC_NAMESCPACE_SECRET_ENV_PREFIX
} from "./config.settings";

function extract_env_vars(prefix: string) {
    return Object.keys(process.env)
        .filter(e => e.startsWith(prefix))
        .map(e => ({
            key: e.replace(new RegExp("^" + prefix, "g"), "")
                .split(SETTINGS_ENV_SEPARATOR),
            value: process.env[e]
        }))
}

async function load_yaml<T>(namespace: string, clazz: ClassConstructor<T>, object: any): Promise<T> {
    //env override
    const keys = extract_env_vars(SETTINGS_GENERIC_NAMESCPACE_ENV_PREFIX(namespace))

    const o: any = keys.reduce((a: any, b) => {
        deepAssign(a, deflatten(b.key, b.value))
        Logger.debug(`Overridden ${b.key.join('.')} = ${b.value}`, `${namespace} settings loader`)
        return a
    }, object)

    //secret override
    const files = extract_env_vars(SETTINGS_GENERIC_NAMESCPACE_SECRET_ENV_PREFIX(namespace))
    const secret_o: any = files.reduce((a: any, b) => {
        if (!fs.existsSync(b.value)) {
            Logger.warn(`Secret file does not exists: ${b.value}`, `${namespace} settings loader`)
            return a
        }
        deepAssign(a, deflatten(b.key, fs.readFileSync(b.value, {encoding: 'utf-8'}).trim()))
        Logger.debug(`Overridden ${b.key.join('.')} = FILE(${b.value})`, `${namespace} settings loader`)
        return a
    }, o)

    //create the class
    const ret: any = plainToInstance(clazz, secret_o)
    const errors: ValidationError[] = await validate(ret);

    if (errors.length == 0) return ret

    Logger.error(`Validation error!`, `${namespace} settings loader`)
    Logger.error("==================================\n" + validationErrorToString(errors), `${namespace} settings loader`)
    throw Error("Config load error")
}

/**
 * Loads configs to a referenced class.
 *
 * Method:
 *  if the main settings file exists (DMS_CONF_FILE || ${PWD}/config.yaml) then try to load from the file
 *      if the subkey [namespace] is present then load with env override and secret override
 *  else try in the main config folder (DMS_CONF_DIR || ${PWD}/config.d)
 *      if the file named as the namespace exists, try to load it with env override and secret override
 *  else load from all the process env variables named as DMS_[namespace]__--- using object flattening convention with secret override.
 *
 * Note A: object flattening convention
 *  Any variable named DMS_{([A-Za-z][A-Za-z0-9]*)}+{__([A-Za-z][A-Za-z0-9]*)}* will be interpreted as a nested object key definition.
 *  After removal of the prefix DMS_ any subpart delimited by the substring '__' will be the object key.
 *  e.g. DMS_DATABASE__cache__duration=3000 will define the object as {DATABASE: {cache: {duration: "3000"}}}
 *
 * Note B: env override
 *  Any key set from a config file can be overridden by the relative env variable defined as in Note A
 *
 * Note C: secret override
 *  Any variable named DMS_SECRET_FILE_{([A-Za-z][A-Za-z0-9]*)}+{__([A-Za-z][A-Za-z0-9]*)}* will be used to populate the unflattened key
 *  with the content of the given file if exists
 *
 */
export function loadYamlConfig<T>(namespace: string, clazz: ClassConstructor<T>, required?: boolean): (() => Promise<T>) & ConfigFactoryKeyHost<Promise<T>> {
    return registerAs(namespace, (): Promise<T> => {
        Logger.log(`Loading settings for ${namespace}`, "settings loader")

        //try main config file
        const main_file_path = process.env[SETTINGS_ENV_CONFIG_FILE_VARIABLE_NAME] || path.resolve(process.cwd(), 'config.yaml')
        Logger.debug(`Trying file ${main_file_path}`, `${namespace} settings loader`)
        if (fs.existsSync(main_file_path)) {
            try {
                const data = yaml.load(fs.readFileSync(main_file_path, {encoding: "utf-8"}))
                if (data[namespace])
                    return load_yaml(namespace, clazz, data[namespace]);
                Logger.debug("No data present under the namespace object!", `${namespace} settings loader`)
            } catch (e) {
                Logger.debug(`Cannot load settings from general file because of the following exception: ${e.message}`, `${namespace} settings loader`)
            }
        } else
            Logger.debug("File does not exists!", `${namespace} settings loader`)

        //try conf directory
        const main_file_dir = process.env[SETTINGS_ENV_CONFIG_DIR_VARIABLE_NAME] || path.resolve(process.cwd(), 'config.d')
        const file = path.resolve(main_file_dir, namespace + ".yaml")
        Logger.debug(`Trying file ${file}`, `${namespace} settings loader`)
        if (fs.existsSync(file)) {
            try {
                const data = yaml.load(fs.readFileSync(file, {encoding: "utf-8"}))
                if (!!data)
                    return load_yaml(namespace, clazz, data[namespace]);
                Logger.debug("No data present under the object!", `${namespace} settings loader`)
            } catch (e) {
                Logger.debug(`Cannot load settings from general file because of the following exception: ${e.message}`, `${namespace} settings loader`)
            }
        } else
            Logger.debug("File does not exists!", `${namespace} settings loader`)

        if (!required)
            return load_yaml(namespace, clazz, {});
        throw new Error(`Config not found for namespace ${namespace}. Please define ${namespace} settings by env variable (${SETTINGS_GENERIC_NAMESCPACE_ENV_PREFIX(namespace)}*) or by defining the key \`${namespace}\` in the file ${path.normalize(process.env[SETTINGS_ENV_CONFIG_FILE_VARIABLE_NAME] || path.resolve(process.cwd(), 'config.yaml'))} or by defining a file ${path.normalize(path.join(process.env[SETTINGS_ENV_CONFIG_DIR_VARIABLE_NAME] || path.resolve(process.cwd(), 'config.d'), `${namespace}.yaml`))} with the \`${namespace}\` key in it.`)
    })
}