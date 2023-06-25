export const SETTINGS_ENV_CONFIG_FILE_VARIABLE_NAME: string = "DMS_CONFIG_FILE"
export const SETTINGS_ENV_CONFIG_DIR_VARIABLE_NAME: string = "DMS_CONFIG_DIR"
export const SETTINGS_GENERIC_NAMESCPACE_ENV_PREFIX: (namespace: string) => string = (namespace: string) => `DMS_${namespace}__`
export const SETTINGS_GENERIC_NAMESCPACE_SECRET_ENV_PREFIX: (namespace: string) => string = (namespace: string) => `DMS_SECRET_FILE_${namespace}__`
export const SETTINGS_ENV_SEPARATOR = "__"