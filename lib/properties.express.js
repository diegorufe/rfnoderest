const crypto = require("crypto");

/**
 * Default properties for rest
 */
const MAP_PROPERTIES = {
  // Name for rest app
  EXPRESS_REST_NAME: "EXPRESS_APP",
  // Default port
  EXPRESS_PORT: 3000,
  // Indicate is rest or not
  REST: true,
  // Propertie for facility secure app
  // https://github.com/helmetjs/helmet
  USE_HELMET: true,
  // Disable powered trusted proxy
  DISABLE_POWERED_BY: true,
  // Turx proxy
  TRUX_PROXY: true,
  // Use csrf protection
  USE_CSRF: false,
  // Use router for manage request
  USE_ROUTER: true,
  // Default api url for rest
  API_URL: "/api",
  // Indicates app is secure or not
  SECURE: true,
  // Default path url rest for manage secure protection
  DEFAULT_PATTERN_SECURE: "/secure/",
  // Request max size response
  BODY_PARSER_SIZE_LIMIT: "50mb",
  // Indicate cors configuration for cross side request
  ENABLE_CORS: false,
  // Default security method
  DEFAULT_SECURITY_METHOD: "jsonwebtoken",
  // Secret passwod for jwt. Change if use this security protection
  SECRET_PASSWORD_JSON_WEB_TOKEN:
    "$2y$12$Z8XyhQRBD50hQ2fGcBn.GOLcE4ippoSNFXjjrBDWuvNLK0KaNIS.a",
  // Time expire json web token
  TIME_EXPIRE_JSON_WEB_TOKEN: 60 * 20,
  // Function to indicates permision for user or not. By default return true
  SEUCRITY_METHOD_INTECERPTOR_PERMISIONS_FUNCTION: null,
  // Path log
  PATH_LOG: null,
  // Max size log
  MAX_SIZE_LOG: 262144000,
  // Max file log
  MAX_FILES_LOG: 5,
  // Services for application
  SERVICES: {},
  // Method to create jwt routes security
  CREATE_JWT_ROUTES_SECURITY: true,
  // Function for login in aplication
  FUNCTION_SECURITY_LOGIN: null,
  // Salt rounds bcrypt
  SALT_ROUNDS_BCRYPT: 10,
  // Key for encryp/decrypt json data in session
  KEY_CRYPTO_JSON_SESSION: crypto.randomBytes(32),
  // Ivi for encryp/decrypt json data in session
  IVI_CRYPTO_JSON_SESSION: crypto.randomBytes(16)
};

/**
 * Map properties status http
 */
const MAP_PROPERTIES_STATUS_HTTP = {
  ACCESS_DENIED: 401,
  ACCESS_SUCCES: 200,
  BAD_GATEWAY: 400
};

module.exports = {
  MAP_PROPERTIES: MAP_PROPERTIES,
  MAP_PROPERTIES_STATUS_HTTP: MAP_PROPERTIES_STATUS_HTTP
};