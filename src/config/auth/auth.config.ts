import {loadYamlConfig} from "../yaml-config-loader";
import {AuthConfig} from "./AuthConfig";

export const authConfig = loadYamlConfig('auth', AuthConfig, true);