module.exports = function (sequelize, DataTypes){
    return sequelize.define('candidate', {
        name:{
            type: DataTypes.STRING,
            allowNull: false,
            trim: true,
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