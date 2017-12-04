/**
* Defines availability model and carries out validation for each availability
*
* @param {obj} sequelize to define availability model for database
* @param {obj} DataTypes to put validation for the fields in availability model
* @return {obj} availability model
*/
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('availability', {
        day: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                len: [1, 250]
            }
        },
        time: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                len: [1, 250]
            }
        }
    });
};