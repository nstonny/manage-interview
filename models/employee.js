module.exports = function(sequelize, DataTypes){
    return sequelize.define('employee', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            trim: true,
            validate:{
                len: [1, 250]
            }
        }
    })
};

