// Express libraries configuration
const EXPRESS = require("./lib/express.config");
// Services and beans services for application
const SERVICES = require("./lib/service.config");
// Configuration for database sequelize
const DATABASE_SEQUELIZE = require("./lib/database.sequelize");
// Configuration for database mongo
const DATABASE_MONGO = require("./lib/database.mongodb");

module.exports = {
  rfnoderest: {
    create_express_app: EXPRESS.create_express_app,
    status_htpp: EXPRESS.status_htpp,
    services: SERVICES,
    databaseSequelize: DATABASE_SEQUELIZE,
    databaseMongo: DATABASE_MONGO,
  },
};
