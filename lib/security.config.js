const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/**
 * Method to sign jwt
 * @param {*} tokenData to sign
 * @param {*} mapPropertiesExpress properties express app
 */
function signJwtFn(tokenData, mapPropertiesExpress) {
  if (
    tokenData != null &&
    tokenData != undefined &&
    tokenData["exp"] != null &&
    tokenData["exp"] != undefined
  ) {
    delete tokenData["exp"];
    delete tokenData["iat"];
  }
  return jsonwebtoken.sign(
    tokenData,
    mapPropertiesExpress.SECRET_PASSWORD_JSON_WEB_TOKEN,
    {
      expiresIn: mapPropertiesExpress.TIME_EXPIRE_JSON_WEB_TOKEN,
    }
  );
}

/**
 * Method to encrypt password in bcrypt
 * @param {*} mapPropertiesExpress properties express app
 * @param {*} password to encrypt
 */
function bcryptPassword(mapPropertiesExpress, password) {
  return bcrypt.hashSync(password, mapPropertiesExpress.SALT_ROUNDS_BCRYPT);
}

/**
 * MEthod to compare bcrypt password
 * @param {*} passwordBcrypt password encrypt
 * @param {*} password real password
 * @returns true if equals passwords false if not
 */
function compareBcrypt(passwordBcrypt, password) {
  return bcrypt.compareSync(password, passwordBcrypt.trim());
}

module.exports = {
  security: {
    jsonwebtoken: jsonwebtoken,
    signJwtFn: signJwtFn,
    bcryptPassword: bcryptPassword,
    compareBcrypt: compareBcrypt,
  },
};
