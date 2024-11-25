const { DataTypes } = require('sequelize');
const db = require("../../../services/db");

const CuoponCode = require("./couponcode.model")(db.sequelize, DataTypes);
const Subscription = require("./subscriptions.model")(db.sequelize, DataTypes);
const Streets = require("./streets.model")(db.sequelize, DataTypes);

const { User } = require("../../users/models");

// define relationships
User.hasOne(Subscription, { foreignKey: 'userId', as:'subscription'});
Subscription.belongsTo(User, { foreignKey: 'userId' });

// streets
// user - roles relationship
Streets.belongsTo(User, { as:'streets' });
User.hasMany(Streets, {});



// CuoponCode.sync({ force: true });
module.exports = { CuoponCode, Subscription, Streets };