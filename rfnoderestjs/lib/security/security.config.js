const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/**
 * Method to sign jwt
 * @param {*} tokenData to sign
 * @param {*} mapPropertiesApp properties  app
 */
function signJwtFn(tokenData, mapPropertiesApp) {
  if (
    tokenData != null &&
    tokenData != undefined &&
    tokenData["exp"] != null &&
    tokenData["exp"] != undefined
  ) {
    delete tokenData["exp"];
    delete tokenData["iat"];
  }
  if (
    mapPropertiesApp.TIME_EXPIRE_JSON_WEB_TOKEN != null &&
    mapPropertiesApp.TIME_EXPIRE_JSON_WEB_TOKEN != undefined
  ) {
    return jsonwebtoken.sign(
      tokenData,
      mapPropertiesApp.SECRET_PASSWORD_JSON_WEB_TOKEN,
      {
        expiresIn: mapPropertiesApp.TIME_EXPIRE_JSON_WEB_TOKEN,
      }
    );
  } else {
    return jsonwebtoken.sign(
      tokenData,
      mapPropertiesApp.SECRET_PASSWORD_JSON_WEB_TOKEN
    );
  }
}

/**
 * Method to encrypt password in bcrypt
 * @param {*} mapPropertiesApp properties app
 * @param {*} password to encrypt
 */
function bcryptPassword(mapPropertiesApp, password) {
  return bcrypt.hashSync(password, mapPropertiesApp.SALT_ROUNDS_BCRYPT);
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
