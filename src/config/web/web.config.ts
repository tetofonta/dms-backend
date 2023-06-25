import {loadYamlConfig} from "../yaml-config-loader";
import {WebConfig} from "./WebConfig";

export const webConfig = loadYamlConfig('web', WebConfig, false);