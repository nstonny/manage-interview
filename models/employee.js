/**
* Defines employee model and carries out validation for each employee
*
* @param {obj} sequelize to define employee model for database
* @param {obj} DataTypes to put validation for the fields in employee model
* @return {obj} employee model
*/
module.exports = function(sequelize, DataTypes){
    return sequelize.define('employee', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                len: [1, 250]
            }
        }
    })
};

