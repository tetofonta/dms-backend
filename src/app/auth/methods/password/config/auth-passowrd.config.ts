import {loadYamlConfig} from "../../../../../config/yaml-config-loader";
import {AuthPasswordConfig} from "./AuthPasswordConfig";

export const authPassowrdConfig = loadYamlConfig('user-local-auth', AuthPasswordConfig)