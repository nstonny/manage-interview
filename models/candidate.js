/**
* Defines candidate model and carries out validation for each candidate
*
* @param {obj} sequelize to define candidate model for database
* @param {obj} DataTypes to put validation for the fields in candidate model
* @return {obj} candidate model
*/
module.exports = function (sequelize, DataTypes){
    return sequelize.define('candidate', {
        name:{
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                len: [1, 250]
            }
        },
        managers:{            
            type: DataTypes.STRING,
            allowNull: false,
            trim: true,
            validate:{
                len: [1, 500]
            }
        }        
    })
};