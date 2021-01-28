
/**
 * Feature for define properties for a class 
 */
export interface IClassPropertiesTypesDefinition {

    /**
     * Method for get props definition for class
     */
    propsDefinition(): { [key: string]: any };
}