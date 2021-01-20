class Field {
  constructor(name, aliasTabla, aliasField, customField) {
    this.name = name;
    this.aliasTabla = aliasTabla;
    this.aliasField = aliasField;
    this.customField = customField;
    this.fieldSeparator = "_FIELD_SEPARATOR_";
  }
}

module.exports = Field;
