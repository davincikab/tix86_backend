const { Sequelize } = require('sequelize');
require('dotenv').config();

// Sequelize instance
// console.log(process.env);
const sequelize = new Sequelize({
    port:process.env.DB_PORT,
    host:process.env.DATABASE_HOST,
    username:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE_NAME,
    dialect:'mysql',
    logging:false,
    pool: {
        max: 1000,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

(async function(){
    try {
        let db = await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;


