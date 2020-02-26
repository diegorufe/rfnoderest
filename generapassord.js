const security = require('./lib/security.config').security;

console.log(security.bcryptPassword({SALT_ROUNDS_BCRYPT : 10}, '1234'))