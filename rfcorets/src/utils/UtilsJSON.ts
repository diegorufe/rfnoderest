
/**
 * Method for parse to json 
 * @param data to pase
 */
export function parseToJson(data: any) {
    return JSON.stringify(data);
}

/**
 * Method for convert json to object
 * @param json to convert
 */
export function jsonToObject(json: string) {
    return JSON.parse(json);
}