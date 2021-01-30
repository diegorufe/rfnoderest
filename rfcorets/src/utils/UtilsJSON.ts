
/**
 * Method for parse to json 
 * @param data to pase
 */
export function parseToJson(data: any) {
    return JSON.parse(data);
}

/**
 * Method for convert json to object
 * @param json to convert
 */
export function jsonToObject(json: string) {
    return JSON.stringify(json);
}