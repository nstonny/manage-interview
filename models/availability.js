module.exports = function(sequelize, DataTypes) {
    return sequelize.define('availability', {
        day: {
            type: DataTypes.STRING,
            allowNull: false,
            trim: true,
            validate:{
                len: [1, 250]
            }
        },
        time: {
            type: DataTypes.STRING,
            allowNull: false,
            trim: true,
            validate:{
                len: [1, 250]
            }
        }
    });
};