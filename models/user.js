/**
* define user model, validation, password hashing nad salting, hooks,
* class and instance methods for user authentication and token generation and authentication
*/

var bcrypt = require('bcrypt');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

/**
* Defines user model and carries out validation for each user
*
* @param {obj} sequelize to define user model for database
* @param {obj} DataTypes to put validation for the fields in user model
* @return {obj} user containing email, password, 'Auth' token if all validation succeeds
* @return {funct} reject() to signal authentication error 
*/
module.exports = function (sequelize, DataTypes) {
    var user = sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        /**
         * used to generate different hashes for the same password from different user 
         */
        salt: {
            type: DataTypes.STRING
        },
        /**
         * used to generate the hashed password using bcrypt 
         */
        password_hash: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                len: [7, 100]
            },
            set: function (value) {
                var salt = bcrypt.genSaltSync(10);
                var hashedPassword = bcrypt.hashSync(value, salt);
                this.setDataValue('password', value);
                this.setDataValue('salt', salt);
                this.setDataValue('password_hash', hashedPassword);
            }
        }
    }, {
            /**
             * convert uppercase email addresses to lowercase to avoid duplication
            */
            hooks: {
                beforeValidate: function (user, options) {
                    if (user.email === 'string') {
                        user.email = user.email.toLowerCase();
                    }
                }
            },
            classMethods: {
                /**
                * authenticates user email and password
                *
                * @param {obj} body body of the request
                * @return {funct} resolve(user) returns user object for the resolve case
                * @return {funct} reject() returns reject case if user validation fails
                */
                authenticate: function (body) {
                    return new Promise(function (resolve, reject) {
                        if (typeof body.email !== 'string' || typeof body.password !== 'string') {
                            return reject();
                        }
                        user.findOne({
                            where: {
                                email: body.email
                            }
                        }).then(function (user) {
                            if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
                                return reject();
                            }
                            resolve(user);
                        }, function (e) {
                            reject();
                        });
                    });
                },
                /**
                * authenticates user email and password
                *
                * @param {obj} body body of the request
                * @return {funct} resolve(user) returns user object for the resolve case
                * @return {funct} reject() returns reject case if user validation fails
                */
                findByToken: function(token) {
                    return new Promise(function(resolve, reject) {
                        try {
                            var decodedJWT = jwt.verify(token, 'qwerty123');
                            var bytes = cryptojs.AES.decrypt(decodedJWT.token, 'abc123!@!#');
                            var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));    
                            user.findById(tokenData.id).then(function (user) {
                                if (user) {
                                    resolve(user);
                                } else {
                                    reject();
                                }
                            }, function (e) {
                                reject();
                            });
                        } catch (e) {
                            reject();
                        }
                    });
                }
            },
            instanceMethods: {
                /**
                * picks out selected attributes to show to the user
                *               
                * @return {obj} json data with the desired attributes
                */
                toPublicJSON: function () {
                    var json = this.toJSON();
                    return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
                },
                /**
                * generates 'Auth' token for user using cryptojs and jsonwebtoken
                *
                * @param {string} type attaches a name to the type of token to be generated  
                * @return {string} the generated token
                * @return {var} undefined if token generation fails
                */
                generateToken: function(type){
                    if(!_.isString(type)){
                        return undefined;
                    }
                    try{
                        var stringData = JSON.stringify({id: this.get('id'), type: type});
                        var encryptedData = cryptojs.AES.encrypt(stringData, 'abc123!@!#').toString();  
                        var token = jwt.sign({
                            token: encryptedData
                        }, 'qwerty123');
                        return token;
                    } catch (e){
                        return undefined;
                    }  
                }
            }
        });
        return user;
};