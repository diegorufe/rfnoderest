const jsonwebtoken = require("jsonwebtoken");

/**
 * Method to sign jwt
 * @param {*} tokenData
 * @param {*} mapPropertiesExpress
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
      expiresIn: mapPropertiesExpress.TIME_EXPIRE_JSON_WEB_TOKEN
    }
  );
}

module.exports = {
  security: {
    jsonwebtoken: jsonwebtoken,
    signJwtFn: signJwtFn
  }
};
