var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if(env === 'production'){
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect : 'postgres'
    })

}else{
     sequelize = new Sequelize(undefined,undefined,undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/data/manage-interview.sqlite'
    });
}

var db = {};

db.employee = sequelize.import(__dirname + '/models/employee.js');
db.candidate = sequelize.import(__dirname + '/models/candidate.js');
db.availability = sequelize.import(__dirname + '/models/availability.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.availability.belongsTo(db.employee);
db.employee.hasMany(db.availability);

module.exports = db;