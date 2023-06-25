import {loadYamlConfig} from "../yaml-config-loader";
import {DatabaseConfig} from "./DatabaseConfig";

export const databaseConfig = loadYamlConfig('database', DatabaseConfig, true)