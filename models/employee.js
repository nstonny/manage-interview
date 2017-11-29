module.exports = function(sequelize, DataTypes) {
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