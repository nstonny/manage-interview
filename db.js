var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined,undefined,undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/data/manage-interview.sqlite'
});

var db = {};

// db.manager = sequelize.import(__dirname + '/models/manager.js');
db.candidate = sequelize.import(__dirname + '/models/candidate.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;